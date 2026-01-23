const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/out', express.static(path.join(__dirname, 'out')));

// In-memory job storage (in production, use Redis or similar)
const jobs = new Map();

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Remotion server is running' });
});

// Generate video
app.post('/api/generate', async (req, res) => {
  try {
    const { tweet, style, grokApiKey, duration, grokImages } = req.body;

    console.log('🎬 Received generation request:');
    console.log('  Style:', style);
    console.log('  Duration:', duration, 'seconds');
    console.log('  Grok Images:', grokImages);

    if (!tweet) {
      return res.status(400).json({ error: 'Tweet data is required' });
    }

    if (!grokApiKey) {
      return res.status(400).json({ error: 'Grok API key is required' });
    }

    // Validate and parse video duration (default: 5 seconds, min: 3, max: 30)
    let durationSeconds = parseInt(duration) || 5;
    durationSeconds = Math.max(3, Math.min(30, durationSeconds));
    const durationInFrames = durationSeconds * 30; // 30 fps

    console.log('  Calculated duration:', durationSeconds, 'seconds =', durationInFrames, 'frames');

    // Create a new job
    const jobId = uuidv4();
    jobs.set(jobId, {
      id: jobId,
      status: 'processing',
      progress: 0,
      message: 'Starting generation...',
      tweet,
      style: style || 'TweetMinimal',
      grokApiKey,
      grokImages: grokImages || false,
      durationInFrames: durationInFrames,
      createdAt: Date.now()
    });

    // Start processing in background
    processVideo(jobId).catch(error => {
      console.error(`Job ${jobId} failed:`, error);
      jobs.set(jobId, {
        ...jobs.get(jobId),
        status: 'failed',
        message: error.message
      });
    });

    res.json({ jobId, status: 'processing' });
  } catch (error) {
    console.error('Generate endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get job status
app.get('/api/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({
    id: job.id,
    status: job.status,
    progress: job.progress,
    message: job.message,
    videoUrl: job.videoUrl,
    error: job.error
  });
});

// Process video
async function processVideo(jobId) {
  const job = jobs.get(jobId);

  try {
    // Update job status
    updateJob(jobId, { progress: 10, message: 'Analyzing tweet...' });

    // Generate Remotion composition using Grok
    const composition = await generateCompositionWithGrok(job.tweet, job.style, job.grokApiKey);

    // Generate AI images if enabled
    let aiImages = [];
    if (job.grokImages) {
      updateJob(jobId, { progress: 15, message: 'Generating AI images...' });
      aiImages = await generateGrokImages(job.tweet, job.style, job.grokApiKey, job.durationInFrames);
      console.log(`Generated ${aiImages.length} AI images`);
    }

    // Generate SVG icon based on tweet content
    updateJob(jobId, { progress: 20, message: 'Generating SVG icon...' });
    const svgIcon = await generateGrokSVG(job.tweet, job.style, job.grokApiKey);
    console.log('Generated SVG icon:', svgIcon ? 'Success' : 'None');

    updateJob(jobId, { progress: 30, message: 'Bundling project...' });

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, 'src/index.ts'),
      webpackOverride: (config) => config,
    });

    console.log('📦 Bundle location:', bundleLocation);

    updateJob(jobId, { progress: 50, message: 'Rendering video...' });

    // Get composition
    const compositionId = getCompositionId(job.style);
    console.log('📹 Selecting composition:', compositionId);
    console.log('  Duration in frames:', job.durationInFrames);
    console.log('  AI Images count:', aiImages ? aiImages.length : 0);

    const comp = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: {
        tweetData: job.tweet,
        durationInFrames: job.durationInFrames,
        aiImages: aiImages,
        svgIcon: svgIcon,
        ...composition
      },
    });

    console.log('  Selected composition:', comp.id);
    console.log('  Default duration:', comp.durationInFrames);

    // Override composition duration with user-specified duration
    comp.durationInFrames = job.durationInFrames;

    console.log('  Overridden duration:', comp.durationInFrames);

    // Ensure output directory exists
    const outDir = path.join(__dirname, 'out');
    await fs.mkdir(outDir, { recursive: true });

    // Output path
    const outputPath = path.join(outDir, `${jobId}.mp4`);

    // Render video with explicit props
    const renderProps = {
      tweetData: job.tweet,
      durationInFrames: job.durationInFrames,
      aiImages: aiImages,
      svgIcon: svgIcon,
      colors: composition.colors,
      timing: composition.timing,
    };

    console.log('🎨 Rendering with props:', JSON.stringify({
      compositionId: comp.id,
      duration: comp.durationInFrames,
      hasAiImages: !!aiImages && aiImages.length > 0,
      aiImagesCount: aiImages ? aiImages.length : 0
    }, null, 2));

    await renderMedia({
      composition: comp,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: renderProps,
      onProgress: ({ progress }) => {
        updateJob(jobId, {
          progress: 50 + (progress * 0.5),
          message: `Rendering: ${Math.round(progress * 100)}%`
        });
      },
    });

    console.log('✅ Render complete:', outputPath);

    // Video is ready
    const videoUrl = `http://localhost:${PORT}/out/${jobId}.mp4`;

    updateJob(jobId, {
      status: 'completed',
      progress: 100,
      message: 'Video ready!',
      videoUrl
    });

  } catch (error) {
    console.error('Processing error:', error);
    updateJob(jobId, {
      status: 'failed',
      message: error.message,
      error: error.stack
    });
  }
}

// Generate AI images using Grok API
async function generateGrokImages(tweet, style, apiKey, durationInFrames) {
  try {
    const numImages = Math.ceil(durationInFrames / 90); // One image every 3 seconds (90 frames)
    const images = [];

    console.log(`🖼️  Generating ${numImages} AI images for video (duration: ${durationInFrames} frames)...`);
    console.log('   Model: grok-2-image-1212');

    for (let i = 0; i < numImages; i++) {
      const prompt = `Create a visually stunning image for a ${style} style video.
Tweet content: "${tweet.text}"
Scene ${i + 1} of ${numImages}.
Style: ${style}. Make it dramatic, eye-catching, and professional.`;

      console.log(`   📸 Generating image ${i + 1}/${numImages}...`);

      const response = await fetch('https://api.x.ai/v1/images/generations', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'grok-2-image-1212',
          prompt: prompt,
          n: 1
        })
      });

      console.log('   Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`   ❌ Grok Images API error (${response.status}):`, errorText);
        continue;
      }

      const data = await response.json();
      if (data.data && data.data[0] && data.data[0].url) {
        images.push({
          url: data.data[0].url,
          startFrame: i * 90
        });
        console.log(`   ✅ Generated image ${i + 1}/${numImages}: ${data.data[0].url.substring(0, 50)}...`);
      } else {
        console.log('   ⚠️  No image URL in response');
      }
    }

    console.log(`🎉 Successfully generated ${images.length}/${numImages} AI images`);
    return images;
  } catch (error) {
    console.error('❌ Error generating Grok images:', error.message);
    return [];
  }
}

// Generate SVG icon based on tweet content using Grok
async function generateGrokSVG(tweet, style, apiKey) {
  try {
    console.log('🎨 Generating SVG icon based on tweet content...');
    console.log('   Model: grok-4-fast-reasoning');

    const prompt = `Based on this tweet content, generate a simple, clean SVG icon that represents the key concept or theme:

Tweet: "${tweet.text}"
Style: ${style}

Requirements:
- Return ONLY the raw SVG code, no markdown, no explanations
- Make it a simple, recognizable icon (not a complex illustration)
- Use a viewBox of "0 0 100 100"
- Keep it to 2-3 shapes maximum
- Use colors that match the ${style} aesthetic
- Make it visually interesting but minimal

Example format:
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="#667eea"/>
  <path d="M30 50 L70 50" stroke="white" stroke-width="3"/>
</svg>`;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-4-fast-reasoning',
        messages: [
          {
            role: 'system',
            content: 'You are an expert SVG designer. Generate clean, minimal SVG icons. Return ONLY raw SVG code without any markdown formatting or explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    console.log('   Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`   ❌ Grok API error (${response.status}):`, errorText);
      return null;
    }

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      let svgContent = data.choices[0].message.content.trim();

      // Remove markdown code blocks if present
      svgContent = svgContent.replace(/```svg\n?/g, '').replace(/```\n?/g, '').trim();

      // Validate it's actual SVG with basic security checks
      if (svgContent.startsWith('<svg') && svgContent.endsWith('</svg>')) {
        // Basic security: check for script tags
        if (svgContent.toLowerCase().includes('<script')) {
          console.error('   ❌ SVG contains script tags - rejected for security');
          return null;
        }

        // Validate SVG has viewBox
        if (!svgContent.includes('viewBox')) {
          console.warn('   ⚠️  SVG missing viewBox, adding default');
          svgContent = svgContent.replace('<svg', '<svg viewBox="0 0 100 100"');
        }

        console.log('   ✅ Generated SVG icon successfully');
        console.log('   SVG preview (first 100 chars):', svgContent.substring(0, 100) + '...');
        return svgContent;
      } else {
        console.error('   ❌ Invalid SVG format returned');
        return null;
      }
    } else {
      console.log('   ⚠️  No SVG content in response');
      return null;
    }
  } catch (error) {
    console.error('❌ Error generating SVG:', error.message);
    return null;
  }
}

// Get the JSON schema for structured output based on style
function getSchemaForStyle(style) {
  const styleLower = style.toLowerCase().replace('tweet', '');

  // Base color schema (common for all styles)
  const colorSchema = {
    type: "object",
    properties: {
      primary: { type: "string", description: "Primary color hex code" },
      secondary: { type: "string", description: "Secondary color hex code" },
      background: { type: "string", description: "Background color hex code or gradient" },
      accent: { type: "string", description: "Accent color hex code" }
    },
    required: ["primary", "secondary", "background", "accent"],
    additionalProperties: false
  };

  // Define timing schemas for each style
  const timingSchemas = {
    minimal: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text appears" },
        imageDelay: { type: "number", description: "Frames before images appear" },
        avatarDelay: { type: "number", description: "Frames before avatar appears" }
      },
      required: ["textDelay", "imageDelay", "avatarDelay"],
      additionalProperties: false
    },
    terminal: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts typing" },
        imageDelay: { type: "number", description: "Frames before images appear" },
        charsPerFrame: { type: "number", description: "Characters to type per frame" }
      },
      required: ["textDelay", "imageDelay", "charsPerFrame"],
      additionalProperties: false
    },
    kinetic: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts animating" },
        imageDelay: { type: "number", description: "Frames before images appear" },
        wordDelay: { type: "number", description: "Frames between each word" }
      },
      required: ["textDelay", "imageDelay", "wordDelay"],
      additionalProperties: false
    },
    typewriter: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts typing" },
        imageDelay: { type: "number", description: "Frames before images appear" },
        charsPerFrame: { type: "number", description: "Characters to type per frame" }
      },
      required: ["textDelay", "imageDelay", "charsPerFrame"],
      additionalProperties: false
    },
    tiktok: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts animating" },
        imageDelay: { type: "number", description: "Frames before images appear" },
        wordDelay: { type: "number", description: "Frames between each word" }
      },
      required: ["textDelay", "imageDelay", "wordDelay"],
      additionalProperties: false
    },
    zoomcut: {
      type: "object",
      properties: {
        wordDelay: { type: "number", description: "Frames between word transitions" },
        cutSpeed: { type: "number", description: "Frames per word cut" }
      },
      required: ["wordDelay", "cutSpeed"],
      additionalProperties: false
    },
    starwars: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before crawl starts" },
        scrollSpeed: { type: "number", description: "Scroll speed multiplier" }
      },
      required: ["textDelay", "scrollSpeed"],
      additionalProperties: false
    },
    speedread: {
      type: "object",
      properties: {
        framesPerWord: { type: "number", description: "Frames to display each word" },
        textDelay: { type: "number", description: "Frames before words start" }
      },
      required: ["framesPerWord", "textDelay"],
      additionalProperties: false
    },
    subwaysurfers: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts" },
        scrollSpeed: { type: "number", description: "Gameplay scroll speed" }
      },
      required: ["textDelay", "scrollSpeed"],
      additionalProperties: false
    },
    minecraftparkour: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts" },
        blockSpeed: { type: "number", description: "Block movement speed" }
      },
      required: ["textDelay", "blockSpeed"],
      additionalProperties: false
    },
    lofi: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts" },
        charsPerFrame: { type: "number", description: "Characters per frame for typewriter" }
      },
      required: ["textDelay", "charsPerFrame"],
      additionalProperties: false
    },
    comicbook: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before bubbles appear" },
        bubbleDelay: { type: "number", description: "Frames between speech bubbles" }
      },
      required: ["textDelay", "bubbleDelay"],
      additionalProperties: false
    },
    matrix: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts" },
        charsPerFrame: { type: "number", description: "Characters per frame" }
      },
      required: ["textDelay", "charsPerFrame"],
      additionalProperties: false
    },
    disney: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts" },
        wordDelay: { type: "number", description: "Frames between each word" }
      },
      required: ["textDelay", "wordDelay"],
      additionalProperties: false
    },
    anime: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts" },
        charsPerFrame: { type: "number", description: "Characters per frame" }
      },
      required: ["textDelay", "charsPerFrame"],
      additionalProperties: false
    },
    pokemon: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts" },
        charsPerFrame: { type: "number", description: "Characters per frame for Pokedex" }
      },
      required: ["textDelay", "charsPerFrame"],
      additionalProperties: false
    },
    fortnite: {
      type: "object",
      properties: {
        textDelay: { type: "number", description: "Frames before text starts" },
        wordDelay: { type: "number", description: "Frames between each word" }
      },
      required: ["textDelay", "wordDelay"],
      additionalProperties: false
    },
    technicalexplainer: {
      type: "object",
      properties: {
        deviceDelay: { type: "number", description: "Frames before devices appear" },
        textDelay: { type: "number", description: "Frames before text appears" },
        buttonDelay: { type: "number", description: "Frames before UI elements appear" }
      },
      required: ["deviceDelay", "textDelay", "buttonDelay"],
      additionalProperties: false
    }
  };

  // Use default generic timing schema for styles without specific schemas
  const defaultTimingSchema = {
    type: "object",
    properties: {
      textDelay: { type: "number", description: "Frames before text appears" },
      imageDelay: { type: "number", description: "Frames before images appear" },
      wordDelay: { type: "number", description: "Frames between each word" }
    },
    required: ["textDelay", "imageDelay", "wordDelay"],
    additionalProperties: false
  };

  const timingSchema = timingSchemas[styleLower] || defaultTimingSchema;

  return {
    type: "json_schema",
    json_schema: {
      name: "composition_config",
      strict: true,
      schema: {
        type: "object",
        properties: {
          colors: colorSchema,
          timing: timingSchema
        },
        required: ["colors", "timing"],
        additionalProperties: false
      }
    }
  };
}

// Generate composition using Grok API
async function generateCompositionWithGrok(tweet, style, apiKey) {
  try {
    console.log('🤖 Calling Grok API for composition generation...');
    console.log('   Model: grok-4-fast-reasoning');
    console.log('   Style:', style);

    // Get the structured output schema for this style
    const responseFormat = getSchemaForStyle(style);
    console.log('   Using structured output schema for style:', style);

    // Call Grok API to generate composition parameters
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-4-fast-reasoning',
        messages: [
          {
            role: 'system',
            content: `You are an expert Remotion developer. Generate a Remotion composition configuration for a tweet video in the "${style}" style. Use appropriate colors and timing that match the style's aesthetic.`
          },
          {
            role: 'user',
            content: `Create a ${style} style video composition for this tweet:\n\nAuthor: ${tweet.author.name} (${tweet.author.username})\nText: ${tweet.text}\nHas media: ${tweet.media && tweet.media.length > 0 ? 'yes' : 'no'}`
          }
        ],
        temperature: 0.7,
        response_format: responseFormat
      })
    });

    console.log('   Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('   ❌ Grok API error response:', errorText);
      throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('   ✅ Grok API responded successfully');

    const content = data.choices[0].message.content;

    // With structured outputs, content is guaranteed to be valid JSON
    try {
      const config = JSON.parse(content);
      console.log('   ✅ Parsed structured output configuration:', config);
      return config;
    } catch (parseError) {
      console.error('   ❌ Failed to parse structured output:', parseError.message);
      console.log('   📝 Falling back to default composition');
      return getDefaultComposition(style);
    }

  } catch (error) {
    console.error('❌ Grok API error:', error.message);
    console.log('📝 Falling back to default composition for style:', style);
    return getDefaultComposition(style);
  }
}

// Default compositions for each style
function getDefaultComposition(style) {
  const baseDefaults = {
    minimal: {
      colors: {
        primary: '#0F172A',
        secondary: '#64748B',
        background: '#FFFFFF',
        accent: '#0084FF'
      },
      timing: {
        textDelay: 10,
        imageDelay: 40,
        avatarDelay: 0
      }
    },
    terminal: {
      colors: {
        primary: '#00FF00',
        secondary: '#FFFFFF',
        background: '#000000',
        accent: '#00FF00'
      },
      timing: {
        textDelay: 0,
        imageDelay: 70,
        charsPerFrame: 2
      }
    },
    kinetic: {
      colors: {
        primary: '#1E293B',
        secondary: '#0084FF',
        background: '#F8FAFC',
        accent: '#FF006E'
      },
      timing: {
        textDelay: 20,
        imageDelay: 60,
        wordDelay: 3
      }
    },
    glassmorphism: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#8B5CF6',
        background: '#1E1E2E',
        accent: '#A78BFA'
      },
      timing: {
        textDelay: 15,
        imageDelay: 50,
        wordDelay: 2.5
      }
    },
    neon: {
      colors: {
        primary: '#FF006E',
        secondary: '#00F0FF',
        background: '#0A0E27',
        accent: '#8B5CF6'
      },
      timing: {
        textDelay: 20,
        imageDelay: 80,
        wordDelay: 2
      }
    },
    explosive: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#FCD34D',
        background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #DC2626 100%)',
        accent: '#FBBF24'
      },
      timing: {
        textDelay: 25,
        imageDelay: 90,
        wordDelay: 2.5
      }
    },
    typewriter: {
      colors: {
        primary: '#2C2416',
        secondary: '#78716C',
        background: '#FEF3C7',
        accent: '#D97706'
      },
      timing: {
        textDelay: 10,
        imageDelay: 80,
        charsPerFrame: 1.5
      }
    },
    tiktok: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#FEE500',
        background: '#000000',
        accent: '#FF0050'
      },
      timing: {
        textDelay: 15,
        imageDelay: 60,
        wordDelay: 2
      }
    },
    mrbeast: {
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        background: '#FF0000',
        accent: '#FFFF00'
      },
      timing: {
        textDelay: 10,
        imageDelay: 45,
        wordDelay: 1.5
      }
    },
    neobrutalism: {
      colors: {
        primary: '#000000',
        secondary: '#FACC15',
        background: '#FBBF24',
        accent: '#000000'
      },
      timing: {
        textDelay: 18,
        imageDelay: 65,
        wordDelay: 2.2
      }
    },
    darkcyber: {
      colors: {
        primary: '#22D3EE',
        secondary: '#A855F7',
        background: '#0F0F23',
        accent: '#06B6D4'
      },
      timing: {
        textDelay: 22,
        imageDelay: 75,
        wordDelay: 2.3
      }
    },
    applesaas: {
      colors: {
        primary: '#000000',
        secondary: '#007AFF',
        background: '#FFFFFF',
        accent: '#5856D6'
      },
      timing: {
        textDelay: 22,
        imageDelay: 75,
        wordDelay: 2.8
      }
    },
    zoomcut: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#FFD700',
        background: '#000000',
        accent: '#FF4500'
      },
      timing: {
        wordDelay: 5,
        cutSpeed: 8
      }
    },
    '3dperspective': {
      colors: {
        primary: '#00D9FF',
        secondary: '#FF00D9',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        accent: '#FFD700'
      },
      timing: {
        textDelay: 15,
        imageDelay: 60
      }
    },
    glitchvhs: {
      colors: {
        primary: '#FF00FF',
        secondary: '#00FFFF',
        background: '#0A0014',
        accent: '#FFD700'
      },
      timing: {
        textDelay: 10,
        imageDelay: 45
      }
    },
    particleburst: {
      colors: {
        primary: '#FFD700',
        secondary: '#FF6B35',
        background: '#1A1A2E',
        accent: '#7B2CBF'
      },
      timing: {
        textDelay: 20,
        imageDelay: 40,
        wordDelay: 2
      }
    },
    starwars: {
      colors: {
        primary: '#FFE81F',
        secondary: '#FFE81F',
        background: '#000000',
        accent: '#4A90E2'
      },
      timing: {
        textDelay: 30,
        scrollSpeed: 3
      }
    },
    speedread: {
      colors: {
        primary: '#000000',
        secondary: '#FF0000',
        background: '#FFFFFF',
        accent: '#4A90E2'
      },
      timing: {
        framesPerWord: 6,
        textDelay: 10
      }
    },
    subwaysurfers: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#FFD700',
        background: '#000000',
        accent: '#FF6B00'
      },
      timing: {
        textDelay: 20,
        scrollSpeed: 2
      }
    },
    minecraftparkour: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#55FF55',
        background: '#87CEEB',
        accent: '#8B4513'
      },
      timing: {
        textDelay: 20,
        blockSpeed: 3
      }
    },
    lofi: {
      colors: {
        primary: '#F4E4C1',
        secondary: '#E8A598',
        background: '#2D3561',
        accent: '#9D84B7'
      },
      timing: {
        textDelay: 20,
        charsPerFrame: 1.5
      }
    },
    comicbook: {
      colors: {
        primary: '#000000',
        secondary: '#FF0000',
        background: '#FFEB3B',
        accent: '#2196F3'
      },
      timing: {
        textDelay: 20,
        bubbleDelay: 40
      }
    },
    matrix: {
      colors: {
        primary: '#00FF00',
        secondary: '#008F00',
        background: '#000000',
        accent: '#FFFFFF'
      },
      timing: {
        textDelay: 30,
        charsPerFrame: 2
      }
    },
    disney: {
      colors: {
        primary: '#FFD700',
        secondary: '#FF69B4',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        accent: '#00CED1'
      },
      timing: {
        textDelay: 15,
        wordDelay: 3
      }
    },
    anime: {
      colors: {
        primary: '#FF1744',
        secondary: '#2979FF',
        background: '#FFF3E0',
        accent: '#FFD600'
      },
      timing: {
        textDelay: 20,
        charsPerFrame: 2
      }
    },
    pokemon: {
      colors: {
        primary: '#FFCB05',
        secondary: '#3D7DCA',
        background: '#FFFFFF',
        accent: '#FF0000'
      },
      timing: {
        textDelay: 15,
        charsPerFrame: 1.5
      }
    },
    fortnite: {
      colors: {
        primary: '#FFC800',
        secondary: '#9D4EDD',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        accent: '#00D9FF'
      },
      timing: {
        textDelay: 15,
        wordDelay: 2
      }
    },
    technicalexplainer: {
      colors: {
        primary: '#1F2937',
        secondary: '#0EA5E9',
        background: '#F8FAFC',
        accent: '#8B5CF6'
      },
      timing: {
        deviceDelay: 10,
        textDelay: 40,
        buttonDelay: 70
      }
    }
  };

  // Find matching style (case insensitive, handle both "TweetXXX" and "xxx" formats)
  const styleLower = style.toLowerCase().replace('tweet', '');
  const config = baseDefaults[styleLower] || baseDefaults.minimal;

  console.log(`📝 Using default config for style "${style}":`, config);
  return config;
}

// Get composition ID based on style
function getCompositionId(style) {
  // If style already has "Tweet" prefix, return as-is
  if (style.startsWith('Tweet')) {
    return style;
  }

  // Otherwise map lowercase to composition IDs
  const ids = {
    'minimal': 'TweetMinimal',
    'terminal': 'TweetTerminal',
    'kinetic': 'TweetKinetic',
    'glassmorphism': 'TweetGlassmorphism',
    'neon': 'TweetNeon',
    'explosive': 'TweetExplosive',
    'typewriter': 'TweetTypewriter',
    'tiktok': 'TweetTikTok',
    'mrbeast': 'TweetMrBeast',
    'neobrutalism': 'TweetNeoBrutalism',
    'darkcyber': 'TweetDarkCyber',
    'applesaas': 'TweetAppleSaaS'
  };
  return ids[style.toLowerCase()] || 'TweetMinimal';
}

// Update job status
function updateJob(jobId, updates) {
  const job = jobs.get(jobId);
  if (job) {
    jobs.set(jobId, { ...job, ...updates });
  }
}

// Clean up old jobs (older than 1 hour)
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  for (const [jobId, job] of jobs.entries()) {
    if (now - job.createdAt > oneHour) {
      jobs.delete(jobId);
      // Optionally delete video file
      const videoPath = path.join(__dirname, 'out', `${jobId}.mp4`);
      fs.unlink(videoPath).catch(() => {});
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Remotion API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
