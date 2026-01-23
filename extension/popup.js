// Popup script for X Article to Video extension

let currentXPostData = null;
let selectedStyles = [];
let generatedVideos = []; // Store all generated videos
let currentVideoIndex = 0; // Track current video in gallery

// Elon-style progress messages
const PROGRESS_MESSAGES = [
  'Groking the multiverse...',
  'Summoning the neural nets...',
  'Achieving AGI... jk, rendering video',
  'Making it happen faster than regulators can complain...',
  'Compressing spacetime into pixels...',
  'Teaching robots to dance...',
  'Optimizing for first principles...',
  'Deploying to Mars datacenter...',
  'Making anime real (the video)...',
  'Running at ludicrous speed...',
  'Calculating probability of success (it\'s high)...',
  'Channeling meme energy...',
  'Breaking through bureaucratic nonsense...',
  'Bootstrapping consciousness... almost there',
  'Pushing pixels at c...',
  'Manifesting destiny (your video)',
  'Turning X posts into cinema...',
  'Accelerating towards singularity...',
  'Making the impossible routine...'
];

function getRandomProgressMessage() {
  return PROGRESS_MESSAGES[Math.floor(Math.random() * PROGRESS_MESSAGES.length)];
}

// Map lowercase style names to Remotion composition IDs
function getCompositionId(styleName) {
  const styleMap = {
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
    'applesaas': 'TweetAppleSaaS',
    'zoomcut': 'TweetZoomCut',
    '3dperspective': 'Tweet3DPerspective',
    'glitchvhs': 'TweetGlitchVHS',
    'particleburst': 'TweetParticleBurst',
    'starwars': 'TweetStarWars',
    'speedread': 'TweetSpeedRead',
    'subwaysurfers': 'TweetSubwaySurfers',
    'minecraftparkour': 'TweetMinecraftParkour',
    'lofi': 'TweetLofi',
    'comicbook': 'TweetComicBook',
    'matrix': 'TweetMatrix',
    'disney': 'TweetDisney',
    'anime': 'TweetAnime',
    'pokemon': 'TweetPokemon',
    'fortnite': 'TweetFortnite',
    'technicalexplainer': 'TweetTechnicalExplainer'
  };
  return styleMap[styleName.toLowerCase()] || styleName;
}

// DOM Elements
const mainView = document.getElementById('mainView');
const settingsView = document.getElementById('settingsView');
const captureSection = document.getElementById('captureSection');
const tweetPreview = document.getElementById('tweetPreview');
const generationProgress = document.getElementById('generationProgress');
const videoPreview = document.getElementById('videoPreview');
const errorMessage = document.getElementById('errorMessage');

// Buttons
const captureTweetBtn = document.getElementById('captureTweetBtn');
const generateVideoBtn = document.getElementById('generateVideoBtn');
const downloadCurrentBtn = document.getElementById('downloadCurrentBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const newVideoBtn = document.getElementById('newVideoBtn');
const settingsBtn = document.getElementById('settingsBtn');
const videosBtn = document.getElementById('videosBtn');
const backBtn = document.getElementById('backBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const prevVideoBtn = document.getElementById('prevVideoBtn');
const nextVideoBtn = document.getElementById('nextVideoBtn');

// Style checkboxes
const styleCheckboxes = document.querySelectorAll('.style-checkbox');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  loadSettings();
  setupEventListeners();
  initializeCarousel();
  checkServerHealth(); // Check server status on load

  // Make header clickable to return home
  const headerTitle = document.querySelector('.header h1');
  if (headerTitle) {
    headerTitle.addEventListener('click', () => {
      resetToCapture();
    });
  }

  // Listen for storage changes to update carousel in real-time
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.videoHistory) {
      updateCarouselFromStorage();
    }
  });

  // Auto-capture tweet when extension opens
  await autoCaptureTweet();
});

function setupEventListeners() {
  captureTweetBtn.addEventListener('click', captureXPost);
  generateVideoBtn.addEventListener('click', generateVideo);
  downloadCurrentBtn.addEventListener('click', downloadCurrentVideo);
  downloadAllBtn.addEventListener('click', downloadAllVideos);
  newVideoBtn.addEventListener('click', resetToCapture);
  settingsBtn.addEventListener('click', showSettings);
  videosBtn.addEventListener('click', () => {
    window.location.href = 'videos.html';
  });
  backBtn.addEventListener('click', showMain);
  saveSettingsBtn.addEventListener('click', saveSettings);
  prevVideoBtn.addEventListener('click', showPreviousVideo);
  nextVideoBtn.addEventListener('click', showNextVideo);

  // Style checkbox listeners
  styleCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const card = checkbox.closest('.style-card');
      const style = card.getAttribute('data-style');

      if (checkbox.checked) {
        if (!selectedStyles.includes(style)) {
          selectedStyles.push(style);
        }
        card.classList.add('selected');
      } else {
        selectedStyles = selectedStyles.filter(s => s !== style);
        card.classList.remove('selected');
      }

      updateGenerateButtonText();

      // Update carousel indicators to show selected styles
      updateIndicatorsForSelection();
    });
  });

  // Initialize selected styles from checked checkboxes
  styleCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const card = checkbox.closest('.style-card');
      const style = card.getAttribute('data-style');
      if (!selectedStyles.includes(style)) {
        selectedStyles.push(style);
      }
      card.classList.add('selected');
    }
  });

  updateGenerateButtonText();

  // Video duration selector
  const videoDurationSelect = document.getElementById('videoDuration');
  if (videoDurationSelect) {
    videoDurationSelect.addEventListener('change', updateDurationPreview);
  }

  // Grok Images toggle (settings page)
  const grokImagesToggle = document.getElementById('grokImages');
  if (grokImagesToggle) {
    grokImagesToggle.addEventListener('change', handleGrokImagesToggle);
  }

  // Grok Images toggle (main page)
  const grokImagesMainToggle = document.getElementById('grokImagesMain');
  if (grokImagesMainToggle) {
    grokImagesMainToggle.addEventListener('change', handleGrokImagesMainToggle);
  }
}

async function handleGrokImagesMainToggle() {
  const grokImagesMainToggle = document.getElementById('grokImagesMain');

  if (grokImagesMainToggle.checked) {
    // Check if Grok API key is set
    const settings = await chrome.storage.local.get(['grokApiKey']);

    if (!settings.grokApiKey || !settings.grokApiKey.startsWith('xai-')) {
      // Disable the toggle and show error
      grokImagesMainToggle.checked = false;

      showError('Please add your Grok API key in Settings first to enable AI Images!');

      setTimeout(() => {
        showError('');
      }, 5000);

      return;
    }

    // Save the setting
    await chrome.storage.local.set({ grokImages: true });
  } else {
    // Save the setting
    await chrome.storage.local.set({ grokImages: false });
  }
}

async function handleGrokImagesToggle() {
  const grokImagesToggle = document.getElementById('grokImages');
  const saveStatus = document.getElementById('saveStatus');

  if (grokImagesToggle.checked) {
    // Check if Grok API key is set
    const settings = await chrome.storage.local.get(['grokApiKey']);

    if (!settings.grokApiKey || !settings.grokApiKey.startsWith('xai-')) {
      // Disable the toggle and show error
      grokImagesToggle.checked = false;

      saveStatus.textContent = 'Please add your Grok API key above first to enable Grok Images!';
      saveStatus.className = 'save-status error';
      saveStatus.classList.remove('hidden');

      setTimeout(() => {
        saveStatus.classList.add('hidden');
      }, 5000);

      // Focus on the API key input
      document.getElementById('grokApiKey').focus();
      return;
    }
  }
}

function updateDurationPreview() {
  const videoDurationSelect = document.getElementById('videoDuration');
  const durationPreview = document.getElementById('durationPreview');
  if (videoDurationSelect && durationPreview) {
    const value = videoDurationSelect.value;
    if (value === 'auto') {
      durationPreview.textContent = 'Duration will be calculated based on tweet content length';
    } else {
      const seconds = parseInt(value);
      const frames = seconds * 30;
      durationPreview.textContent = `${seconds} seconds (${frames} frames @ 30fps)`;
    }
  }
}

function initializeCarousel() {
  const carouselTrack = document.querySelector('.carousel-track');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const styleCards = document.querySelectorAll('.style-card');
  const indicators = document.querySelectorAll('.indicator');

  if (!carouselTrack || !prevBtn || !nextBtn) return;

  // Wait for layout to settle
  setTimeout(() => {
    const cardWidth = styleCards[0] ? styleCards[0].offsetWidth + 12 : 188;

    const updateButtons = () => {
      const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
      const atStart = carouselTrack.scrollLeft <= 5;
      const atEnd = carouselTrack.scrollLeft >= maxScroll - 5;

      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;

      console.log('Carousel update:', {
        scrollLeft: carouselTrack.scrollLeft,
        scrollWidth: carouselTrack.scrollWidth,
        clientWidth: carouselTrack.clientWidth,
        maxScroll,
        atStart,
        atEnd
      });
    };

    const updateIndicators = () => {
      const scrollPercentage = carouselTrack.scrollLeft / (carouselTrack.scrollWidth - carouselTrack.clientWidth);
      const activeIndex = Math.round(scrollPercentage * (indicators.length - 1));

      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === activeIndex);
      });
    };

    window.updateIndicatorsForSelection = () => {
      indicators.forEach((indicator, i) => {
        const card = styleCards[i];
        if (card) {
          const style = card.getAttribute('data-style');
          const isSelected = selectedStyles.includes(style);
          indicator.classList.toggle('has-selected', isSelected);
        }
      });
    };

    prevBtn.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
      setTimeout(updateButtons, 300);
      setTimeout(updateIndicators, 300);
    });

    nextBtn.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
      setTimeout(updateButtons, 300);
      setTimeout(updateIndicators, 300);
    });

    carouselTrack.addEventListener('scroll', () => {
      updateButtons();
      updateIndicators();
    });

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        const targetScroll = (carouselTrack.scrollWidth - carouselTrack.clientWidth) * (index / (indicators.length - 1));
        carouselTrack.scrollTo({ left: targetScroll, behavior: 'smooth' });
      });
    });

    updateButtons();
  }, 100);
}

function updateGenerateButtonText() {
  const count = selectedStyles.length;
  if (count === 0) {
    generateVideoBtn.textContent = 'Select a style';
    generateVideoBtn.disabled = true;
  } else if (count === 1) {
    generateVideoBtn.textContent = 'Generate Video';
    generateVideoBtn.disabled = false;
  } else {
    generateVideoBtn.textContent = `Generate ${count} Videos`;
    generateVideoBtn.disabled = false;
  }

  console.log('Selected styles:', selectedStyles, 'Button disabled:', generateVideoBtn.disabled);
}

async function autoCaptureTweet() {
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Only auto-capture if we're on Twitter/X
    if (!tab.url || (!tab.url.includes('twitter.com') && !tab.url.includes('x.com'))) {
      return; // Silently skip if not on X
    }

    // Update button to show capturing
    captureTweetBtn.textContent = 'Capturing...';
    captureTweetBtn.disabled = true;

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'captureTweet' });

    if (response.success && response.data) {
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Check if multiple posts were found
      if (response.data.multiplePosts) {
        displayMultiplePostsSelector(response.data.posts);
      } else {
        currentXPostData = response.data;
        displayXPostPreview(response.data);
        captureSection.classList.add('hidden');
        tweetPreview.classList.remove('hidden');

        // Initialize button state
        updateGenerateButtonText();
      }
    } else {
      throw new Error('Failed to capture X post');
    }
  } catch (error) {
    // Show error but keep capture button available
    let errorMsg = error.message;
    if (error.message.includes('Could not establish connection')) {
      errorMsg = 'Extension not loaded properly. Please:\n1. Go to chrome://extensions/\n2. Find "X Article to Video"\n3. Click the reload button\n4. Try again';
    }
    showError(errorMsg);
    captureTweetBtn.disabled = false;
    // Restore button HTML
    captureTweetBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
        <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
      Capture X Post
    `;
  }
}

async function captureXPost() {
  showError('');
  captureTweetBtn.disabled = true;

  // Store original HTML
  const originalHTML = captureTweetBtn.innerHTML;
  captureTweetBtn.textContent = 'Capturing...';

  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if we're on Twitter/X
    if (!tab.url.includes('twitter.com') && !tab.url.includes('x.com')) {
      throw new Error('Please navigate to an X post on Twitter/X');
    }

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'captureTweet' });

    if (response.success && response.data) {
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Check if multiple posts were found
      if (response.data.multiplePosts) {
        displayMultiplePostsSelector(response.data.posts);
      } else {
        currentXPostData = response.data;
        displayXPostPreview(response.data);
        captureSection.classList.add('hidden');
        tweetPreview.classList.remove('hidden');

        // Initialize button state
        updateGenerateButtonText();
      }
    } else {
      throw new Error('Failed to capture X post');
    }
  } catch (error) {
    // Enhanced error message
    let errorMsg = error.message;
    if (error.message.includes('Could not establish connection')) {
      errorMsg = 'Extension not loaded properly. Please:\n1. Go to chrome://extensions/\n2. Find "X Article to Video"\n3. Click the reload button\n4. Try again';
    }
    showError(errorMsg);
    captureTweetBtn.disabled = false;
    captureTweetBtn.innerHTML = originalHTML;
  }
}

function displayMultiplePostsSelector(posts) {
  // Hide capture section
  captureSection.classList.add('hidden');

  // Create or get the post selector section
  let postSelectorSection = document.getElementById('postSelectorSection');

  if (!postSelectorSection) {
    postSelectorSection = document.createElement('div');
    postSelectorSection.id = 'postSelectorSection';
    postSelectorSection.style.cssText = 'padding: 16px; overflow-y: auto; max-height: 520px;';
    mainView.appendChild(postSelectorSection);
  }

  // Build the post selector UI
  postSelectorSection.innerHTML = `
    <h3 style="margin-bottom: 12px; font-size: 14px; color: #ffffff;">Found ${posts.length} X Posts - Select one:</h3>
    <div id="postsList" style="display: flex; flex-direction: column; gap: 12px;"></div>
  `;

  const postsList = postSelectorSection.querySelector('#postsList');

  posts.forEach((post, index) => {
    const postCard = document.createElement('div');
    postCard.className = 'tweet-card';
    postCard.style.cursor = 'pointer';
    postCard.style.transition = 'all 0.2s';

    postCard.innerHTML = `
      <div class="tweet-author">
        ${post.author.profilePicUrl ? `<img src="${post.author.profilePicUrl}" alt="Profile" class="avatar">` : ''}
        <div>
          <div class="author-name">${post.author.name}</div>
          <div class="author-username">${post.author.username}</div>
        </div>
      </div>
      <div class="tweet-text">${post.text}</div>
    `;

    postCard.addEventListener('click', () => {
      currentXPostData = post;
      displayXPostPreview(post);
      postSelectorSection.classList.add('hidden');
      tweetPreview.classList.remove('hidden');
      updateGenerateButtonText();
    });

    postCard.addEventListener('mouseenter', () => {
      postCard.style.borderColor = '#0a84ff';
      postCard.style.background = 'rgba(10, 132, 255, 0.08)';
    });

    postCard.addEventListener('mouseleave', () => {
      postCard.style.borderColor = '#38383a';
      postCard.style.background = '#2c2c2e';
    });

    postsList.appendChild(postCard);
  });

  postSelectorSection.classList.remove('hidden');
}

function displayXPostPreview(data) {
  // Author info
  if (data.author.profilePicUrl) {
    document.getElementById('authorAvatar').src = data.author.profilePicUrl;
  }
  document.getElementById('authorName').textContent = data.author.name;
  document.getElementById('authorUsername').textContent = data.author.username;

  // X Post text
  document.getElementById('tweetText').textContent = data.text;

  // Media
  const mediaContainer = document.getElementById('tweetMedia');
  mediaContainer.innerHTML = '';

  if (data.media && data.media.length > 0) {
    data.media.forEach(item => {
      if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.url;
        img.alt = 'X Post image';
        mediaContainer.appendChild(img);
      } else if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.url;
        video.poster = item.poster;
        video.controls = false;
        mediaContainer.appendChild(video);
      }
    });
  }
}

// Calculate duration based on content length
function calculateContentBasedDuration(text) {
  // Validate input
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn('⚠️  Empty or invalid text for duration calculation, using minimum duration');
    return 5;
  }

  // Count words
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  // Handle edge case: very short text
  if (words === 0) {
    return 5;
  }

  // Base duration calculation:
  // - Reading speed: ~3 words per second (comfortable reading pace)
  // - Add 2 seconds for intro/outro animations
  // - Minimum: 5 seconds
  // - Maximum: 30 seconds

  const baseSeconds = Math.ceil(words / 3);
  const withPadding = baseSeconds + 2;

  const duration = Math.max(5, Math.min(30, withPadding));

  console.log('📊 Content-based duration calculation:', {
    text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
    words: words,
    baseSeconds: baseSeconds,
    withPadding: withPadding,
    finalDuration: duration
  });

  return duration;
}

// Helper functions for carousel card states
function showSpinnerOnCard(style) {
  const card = document.querySelector(`.style-card[data-style="${style}"]`);
  if (!card) return;

  const label = card.querySelector('.style-card-content');
  if (!label) return;

  // Add spinner overlay
  let spinnerOverlay = label.querySelector('.card-spinner-overlay');
  if (!spinnerOverlay) {
    spinnerOverlay = document.createElement('div');
    spinnerOverlay.className = 'card-spinner-overlay';
    spinnerOverlay.innerHTML = `
      <div class="card-spinner"></div>
    `;
    label.appendChild(spinnerOverlay);
  }
  spinnerOverlay.style.display = 'flex';
}

function showCompletedOnCard(style) {
  const card = document.querySelector(`.style-card[data-style="${style}"]`);
  if (!card) return;

  const label = card.querySelector('.style-card-content');
  if (!label) return;

  // Remove spinner, add checkmark
  const spinnerOverlay = label.querySelector('.card-spinner-overlay');
  if (spinnerOverlay) {
    spinnerOverlay.innerHTML = `
      <div class="card-status-icon completed">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
    `;

    // Remove after 2 seconds
    setTimeout(() => {
      spinnerOverlay.style.display = 'none';
    }, 2000);
  }
}

function showFailedOnCard(style) {
  const card = document.querySelector(`.style-card[data-style="${style}"]`);
  if (!card) return;

  const label = card.querySelector('.style-card-content');
  if (!label) return;

  // Remove spinner, add X icon
  const spinnerOverlay = label.querySelector('.card-spinner-overlay');
  if (spinnerOverlay) {
    spinnerOverlay.innerHTML = `
      <div class="card-status-icon failed">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </div>
    `;

    // Remove after 2 seconds
    setTimeout(() => {
      spinnerOverlay.style.display = 'none';
    }, 2000);
  }
}

function updateCarouselFromStorage() {
  // This function updates carousel UI based on storage changes
  // Can be expanded to show processing/completed badges
  chrome.storage.local.get(['videoHistory'], (result) => {
    const history = result.videoHistory || [];

    // Find any currently processing videos
    const processingVideos = history.filter(v => v.status === 'processing');
    const completedVideos = history.filter(v => v.status === 'completed');
    const failedVideos = history.filter(v => v.status === 'failed');

    // Update carousel cards
    processingVideos.forEach(video => {
      showSpinnerOnCard(video.style.toLowerCase().replace('tweet', ''));
    });
  });
}

async function addVideoToStorage(videoData) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['videoHistory'], (result) => {
      const history = result.videoHistory || [];
      history.push(videoData);
      chrome.storage.local.set({ videoHistory: history }, () => {
        resolve();
      });
    });
  });
}

async function updateVideoInStorage(videoId, updates) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['videoHistory'], (result) => {
      const history = result.videoHistory || [];
      const videoIndex = history.findIndex(v => v.id === videoId);

      if (videoIndex !== -1) {
        history[videoIndex] = { ...history[videoIndex], ...updates };
        chrome.storage.local.set({ videoHistory: history }, () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
}

async function generateVideo() {
  showError('');
  generateVideoBtn.disabled = true;

  // Check if any styles are selected
  if (selectedStyles.length === 0) {
    showError('Please select at least one style');
    generateVideoBtn.disabled = false;
    return;
  }

  // Validate tweet data
  if (!currentXPostData || !currentXPostData.text || currentXPostData.text.trim().length === 0) {
    showError('Tweet data is invalid or empty. Please capture a tweet first.');
    generateVideoBtn.disabled = false;
    return;
  }

  try {
    // Load settings
    const settings = await chrome.storage.local.get(['grokApiKey', 'remotionServer', 'videoDuration', 'grokImages']);

    if (!settings.grokApiKey) {
      throw new Error('Please set your Grok API key in settings');
    }

    if (!settings.remotionServer) {
      throw new Error('Please set your Remotion server URL in settings');
    }

    // Calculate video duration
    let videoDuration;
    if (settings.videoDuration === 'auto') {
      // Calculate based on content length
      videoDuration = calculateContentBasedDuration(currentXPostData.text);
      console.log(`✨ Using content-based duration: ${videoDuration} seconds`);
    } else {
      // Use fixed duration
      videoDuration = parseInt(settings.videoDuration) || 5;
      console.log(`⏱️  Using fixed duration: ${videoDuration} seconds`);
    }

    const grokImages = settings.grokImages || false;

    // Show progress view
    tweetPreview.classList.add('hidden');
    generationProgress.classList.remove('hidden');

    // Initialize progress UI for multiple videos
    initializeMultiVideoProgress(selectedStyles);

    // Generate videos for all selected styles
    generatedVideos = [];

    for (let i = 0; i < selectedStyles.length; i++) {
      const style = selectedStyles[i];
      const compositionId = getCompositionId(style);

      // Create video entry in storage with 'processing' status
      const videoId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const videoEntry = {
        id: videoId,
        status: 'processing',
        style: compositionId,
        styleName: style.charAt(0).toUpperCase() + style.slice(1).replace(/([A-Z])/g, ' $1'),
        text: currentXPostData.text,
        author: currentXPostData.author,
        timestamp: Date.now(),
        duration: videoDuration,
        videoUrl: null
      };

      // Add to storage and show spinner on carousel card
      await addVideoToStorage(videoEntry);
      showSpinnerOnCard(style);

      updateJobProgress(`job-${i}`, style, 'processing', 'Starting...', 0);

      // Send to Remotion server
      const response = await fetch(`${settings.remotionServer}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tweet: currentXPostData,
          style: compositionId,
          grokApiKey: settings.grokApiKey,
          duration: videoDuration,
          grokImages: grokImages
        })
      });

      if (!response.ok) {
        updateJobProgress(`job-${i}`, style, 'failed', `Server error: ${response.statusText}`, 0);
        await updateVideoInStorage(videoId, { status: 'failed' });
        showFailedOnCard(style);
        continue;
      }

      const result = await response.json();

      if (result.error) {
        updateJobProgress(`job-${i}`, style, 'failed', result.error, 0);
        await updateVideoInStorage(videoId, { status: 'failed' });
        showFailedOnCard(style);
        continue;
      }

      updateJobProgress(`job-${i}`, style, 'processing', getRandomProgressMessage(), 10);

      // Poll for render status
      try {
        const videoData = await pollRenderStatus(result.jobId, settings.remotionServer, `job-${i}`, style);

        // Update storage with completed video
        await updateVideoInStorage(videoId, {
          status: 'completed',
          videoUrl: videoData.videoUrl
        });

        generatedVideos.push({
          style: style,
          url: videoData.videoUrl,
          duration: null // Will be set when video loads
        });

        updateJobProgress(`job-${i}`, style, 'completed', 'Complete!', 100);
        showCompletedOnCard(style);
      } catch (error) {
        updateJobProgress(`job-${i}`, style, 'failed', error.message, 0);
        await updateVideoInStorage(videoId, { status: 'failed' });
        showFailedOnCard(style);
      }
    }

    // All videos generated, show gallery
    if (generatedVideos.length > 0) {
      setTimeout(() => {
        displayVideoGallery();
      }, 500);
    } else {
      throw new Error('All video generations failed. Please try again.');
    }

  } catch (error) {
    // Enhanced error message for connection issues
    let errorMsg = error.message;
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMsg = 'Cannot connect to server!\n\n' +
                 'Make sure the server is running:\n' +
                 '1. Open Terminal\n' +
                 '2. Navigate to project folder\n' +
                 '3. Run: npm run server\n' +
                 '4. Wait for "server running" message\n' +
                 '5. Try again';
    }
    showError(errorMsg);
    generationProgress.classList.add('hidden');
    tweetPreview.classList.remove('hidden');
    generateVideoBtn.disabled = false;
  }
}

function initializeMultiVideoProgress(styles) {
  const progressContainer = document.getElementById('generationProgress');
  const scrollableContent = progressContainer.querySelector('.scrollable-content');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  // Hide single progress bar
  progressFill.style.display = 'none';

  // Update header with count badge instead of spinner
  progressText.innerHTML = `
    Generating Video
    <span style="display: inline-block; margin-left: 8px; background: #0a84ff; color: #ffffff; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">
      ${styles.length} ${styles.length > 1 ? 'videos' : 'video'}
    </span>
  `;
  progressText.style.textAlign = 'center';
  progressText.style.marginBottom = '20px';
  progressText.style.fontSize = '16px';
  progressText.style.fontWeight = '600';

  // Create progress list
  const progressList = document.createElement('div');
  progressList.id = 'multiVideoProgressList';
  progressList.style.cssText = 'display: flex; flex-direction: column; gap: 12px; padding: 0;';

  styles.forEach((style, index) => {
    const jobItem = document.createElement('div');
    jobItem.id = `job-${index}`;

    const statusIcon = document.createElement('span');
    statusIcon.className = 'job-status-icon';
    statusIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    `;
    statusIcon.style.color = '#98989d';

    const styleName = document.createElement('span');
    styleName.className = 'job-style-name';
    styleName.textContent = style.charAt(0).toUpperCase() + style.slice(1).replace(/([A-Z])/g, ' $1');
    styleName.style.cssText = 'font-weight: 600; min-width: 120px; color: #ffffff;';

    const statusText = document.createElement('span');
    statusText.className = 'job-status-text';
    statusText.textContent = 'Waiting...';
    statusText.style.cssText = 'flex: 1; font-size: 13px; color: #98989d;';

    const progressPercent = document.createElement('span');
    progressPercent.className = 'job-progress-percent';
    progressPercent.textContent = '0%';
    progressPercent.style.cssText = 'font-size: 13px; color: #98989d; min-width: 50px; text-align: right; font-weight: 500;';

    jobItem.appendChild(statusIcon);
    jobItem.appendChild(styleName);
    jobItem.appendChild(statusText);
    jobItem.appendChild(progressPercent);

    jobItem.style.cssText = 'display: flex; align-items: center; gap: 12px;';

    progressList.appendChild(jobItem);
  });

  // Remove old progress list if exists
  const oldList = document.getElementById('multiVideoProgressList');
  if (oldList) {
    oldList.remove();
  }

  // Append to scrollable-content div for proper scrolling
  if (scrollableContent) {
    scrollableContent.appendChild(progressList);
  } else {
    progressContainer.appendChild(progressList);
  }
}

async function pollRenderStatus(jobId, serverUrl, jobElementId, style) {
  const maxAttempts = 60; // 60 * 2 seconds = 2 minutes max
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/status/${jobId}`);
        const status = await response.json();

        if (status.error) {
          reject(new Error(status.error));
          return;
        }

        const progress = status.progress || 0;

        if (status.status === 'completed') {
          resolve({ videoUrl: status.videoUrl });
          return;
        }

        if (status.status === 'failed') {
          reject(new Error(status.message || 'Rendering failed'));
          return;
        }

        // Update progress
        updateJobProgress(jobElementId, style, 'processing', status.message || getRandomProgressMessage(), Math.round(progress));

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000); // Poll every 2 seconds
        } else {
          reject(new Error('Render timeout - please try again'));
        }
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}

function updateJobProgress(jobId, style, status, message, progress) {
  const jobItem = document.getElementById(jobId);
  if (!jobItem) return;

  const statusIcon = jobItem.querySelector('.job-status-icon');
  const statusText = jobItem.querySelector('.job-status-text');
  const progressPercent = jobItem.querySelector('.job-progress-percent');

  if (status === 'completed') {
    // Checkmark icon
    statusIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    `;
    statusIcon.style.color = '#30d158';
    statusText.textContent = message;
    progressPercent.textContent = '100%';
    progressPercent.style.color = '#30d158';
  } else if (status === 'failed') {
    // X icon
    statusIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
      </svg>
    `;
    statusIcon.style.color = '#ff453a';
    statusText.textContent = message;
    progressPercent.textContent = '0%';
    progressPercent.style.color = '#ff453a';
  } else {
    // Loader icon
    statusIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    `;
    statusIcon.style.color = '#0a84ff';
    statusText.textContent = message;
    progressPercent.textContent = `${progress}%`;
  }
}

function displayVideoGallery() {
  generationProgress.classList.add('hidden');
  videoPreview.classList.remove('hidden');

  currentVideoIndex = 0;

  // Populate thumbnail gallery
  const thumbnailGallery = document.getElementById('thumbnailGallery');
  thumbnailGallery.innerHTML = '';

  generatedVideos.forEach((video, index) => {
    const thumbnailItem = document.createElement('div');
    thumbnailItem.className = `thumbnail-item ${index === 0 ? 'active' : ''}`;
    thumbnailItem.innerHTML = `
      <div class="thumbnail-video-wrapper">
        <video class="thumbnail-video" src="${video.url}" muted></video>
      </div>
      <div class="thumbnail-label">${video.style}</div>
    `;

    thumbnailItem.addEventListener('click', () => {
      switchToVideo(index);
    });

    thumbnailGallery.appendChild(thumbnailItem);
  });

  // Display first video
  switchToVideo(0);
}

function switchToVideo(index) {
  if (index < 0 || index >= generatedVideos.length) return;

  currentVideoIndex = index;
  const video = generatedVideos[index];

  // Update main player
  const videoPlayer = document.getElementById('videoPlayer');
  videoPlayer.src = video.url;

  // Auto-play the video
  videoPlayer.play().catch(err => {
    console.log('Auto-play prevented:', err);
  });

  // Update video info
  document.getElementById('currentStyleName').textContent = video.style;

  // Update duration when metadata loads
  videoPlayer.addEventListener('loadedmetadata', () => {
    const duration = formatDuration(videoPlayer.duration);
    video.duration = videoPlayer.duration;
    document.getElementById('currentVideoDuration').textContent = duration;
  }, { once: true });

  // Update active thumbnail
  const thumbnails = document.querySelectorAll('.thumbnail-item');
  thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });

  // Auto-scroll thumbnail gallery to show active video
  const activeThumbnail = document.querySelector('.thumbnail-item.active');
  if (activeThumbnail) {
    activeThumbnail.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  // Update navigation buttons
  prevVideoBtn.disabled = index === 0;
  nextVideoBtn.disabled = index === generatedVideos.length - 1;
}

function showPreviousVideo() {
  if (currentVideoIndex > 0) {
    switchToVideo(currentVideoIndex - 1);
  }
}

function showNextVideo() {
  if (currentVideoIndex < generatedVideos.length - 1) {
    switchToVideo(currentVideoIndex + 1);
  }
}

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function downloadCurrentVideo() {
  if (generatedVideos.length === 0) {
    showError('No video to download');
    return;
  }

  const currentVideo = generatedVideos[currentVideoIndex];

  try {
    // Download the current video
    await chrome.downloads.download({
      url: currentVideo.url,
      filename: `xpost-video-${currentVideo.style}-${Date.now()}.mp4`,
      saveAs: true
    });
  } catch (error) {
    showError(`Download failed: ${error.message}`);
  }
}

async function downloadAllVideos() {
  if (generatedVideos.length === 0) {
    showError('No videos to download');
    return;
  }

  try {
    // Disable button during download
    downloadAllBtn.disabled = true;
    const originalHTML = downloadAllBtn.innerHTML;
    downloadAllBtn.textContent = 'Downloading...';

    // Download each video sequentially with a short delay
    for (let i = 0; i < generatedVideos.length; i++) {
      const video = generatedVideos[i];
      await chrome.downloads.download({
        url: video.url,
        filename: `xpost-video-${video.style}-${Date.now()}.mp4`,
        saveAs: false // Don't prompt for each file
      });

      // Small delay between downloads
      if (i < generatedVideos.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Show success message
    downloadAllBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Downloaded!
    `;

    setTimeout(() => {
      downloadAllBtn.innerHTML = originalHTML;
      downloadAllBtn.disabled = false;
    }, 2000);

  } catch (error) {
    showError(`Download failed: ${error.message}`);
    downloadAllBtn.disabled = false;
    downloadAllBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        <polyline points="7 11 12 16 17 11" />
        <line x1="12" y1="16" x2="12" y2="4" />
      </svg>
      Download All
    `;
  }
}

function resetToCapture() {
  currentXPostData = null;
  selectedStyles = [];
  generatedVideos = [];
  currentVideoIndex = 0;

  videoPreview.classList.add('hidden');
  generationProgress.classList.add('hidden');
  tweetPreview.classList.add('hidden');
  captureSection.classList.remove('hidden');

  // Hide post selector if it exists
  const postSelectorSection = document.getElementById('postSelectorSection');
  if (postSelectorSection) {
    postSelectorSection.classList.add('hidden');
  }

  captureTweetBtn.disabled = false;
  captureTweetBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
      <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
    Capture X Post
  `;

  // Reset style checkboxes - first one selected by default
  styleCheckboxes.forEach((checkbox, index) => {
    checkbox.checked = index === 0;
  });
  selectedStyles = ['minimal'];

  // Reset generate button text
  updateGenerateButtonText();

  // Reset progress UI
  const progressFill = document.getElementById('progressFill');
  const progressList = document.getElementById('multiVideoProgressList');
  if (progressFill) {
    progressFill.style.display = 'block';
  }
  if (progressList) {
    progressList.remove();
  }
}

function showSettings() {
  mainView.classList.add('hidden');
  settingsView.classList.remove('hidden');
  checkServerHealth(); // Check server status when opening settings
}

function showMain() {
  settingsView.classList.add('hidden');
  mainView.classList.remove('hidden');
}

async function loadSettings() {
  const settings = await chrome.storage.local.get(['grokApiKey', 'remotionServer', 'videoDuration', 'grokImages']);

  if (settings.grokApiKey) {
    document.getElementById('grokApiKey').value = settings.grokApiKey;
  }

  if (settings.remotionServer) {
    document.getElementById('remotionServer').value = settings.remotionServer;
  } else {
    document.getElementById('remotionServer').value = 'http://localhost:3000';
  }

  const videoDurationSelect = document.getElementById('videoDuration');
  if (videoDurationSelect) {
    if (settings.videoDuration) {
      videoDurationSelect.value = settings.videoDuration;
    }
    updateDurationPreview();
  }

  const grokImagesToggle = document.getElementById('grokImages');
  if (grokImagesToggle) {
    grokImagesToggle.checked = settings.grokImages || false;
  }

  const grokImagesMainToggle = document.getElementById('grokImagesMain');
  if (grokImagesMainToggle) {
    grokImagesMainToggle.checked = settings.grokImages || false;
  }
}

async function saveSettings() {
  const grokApiKey = document.getElementById('grokApiKey').value.trim();
  const remotionServer = document.getElementById('remotionServer').value.trim();
  const videoDuration = document.getElementById('videoDuration').value;
  const grokImages = document.getElementById('grokImages').checked;
  const saveStatus = document.getElementById('saveStatus');

  if (!grokApiKey) {
    saveStatus.textContent = 'Please enter a Grok API key';
    saveStatus.className = 'save-status error';
    saveStatus.classList.remove('hidden');
    return;
  }

  if (!remotionServer) {
    saveStatus.textContent = 'Please enter a Remotion server URL';
    saveStatus.className = 'save-status error';
    saveStatus.classList.remove('hidden');
    return;
  }

  try {
    // Check server health first
    const serverOk = await checkServerHealth();

    if (!serverOk) {
      saveStatus.textContent = 'Settings saved, but server is not running';
      saveStatus.className = 'save-status error';
      saveStatus.classList.remove('hidden');
    }

    // Check Grok API key format (basic validation)
    if (!grokApiKey.startsWith('xai-')) {
      saveStatus.textContent = 'API key should start with "xai-". Double check it!';
      saveStatus.className = 'save-status error';
      saveStatus.classList.remove('hidden');

      setTimeout(() => {
        saveStatus.classList.add('hidden');
      }, 5000);
      return;
    }

    // If Grok Images is enabled, validate API key is present
    if (grokImages && !grokApiKey) {
      saveStatus.textContent = 'Grok Images requires a valid API key';
      saveStatus.className = 'save-status error';
      saveStatus.classList.remove('hidden');
      return;
    }

    await chrome.storage.local.set({
      grokApiKey,
      remotionServer,
      videoDuration: parseInt(videoDuration),
      grokImages
    });

    if (serverOk) {
      saveStatus.textContent = 'Settings saved successfully' + (grokImages ? ' (Grok Images enabled)' : '');
      saveStatus.className = 'save-status success';
      saveStatus.classList.remove('hidden');
    }

    setTimeout(() => {
      saveStatus.classList.add('hidden');
    }, 3000);
  } catch (error) {
    saveStatus.textContent = `Failed to save: ${error.message}`;
    saveStatus.className = 'save-status error';
    saveStatus.classList.remove('hidden');
  }
}

async function checkServerHealth() {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const statusDotMain = document.getElementById('statusDotMain');
  const statusDotMainIndicator = statusDotMain ? statusDotMain.querySelector('.status-dot-indicator') : null;
  const remotionServer = document.getElementById('remotionServer').value.trim() || 'http://localhost:3000';

  // Update UI to show checking state
  if (statusDot) {
    statusDot.className = 'status-dot';
    statusText.textContent = 'Checking server...';
  }
  if (statusDotMainIndicator) {
    statusDotMainIndicator.className = 'status-dot-indicator';
    statusDotMain.title = 'Checking server...';
  }

  try {
    const response = await fetch(`${remotionServer}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    });

    if (response.ok) {
      const data = await response.json();
      if (statusDot) {
        statusDot.className = 'status-dot online';
        statusText.textContent = 'Server is running';
      }
      if (statusDotMainIndicator) {
        statusDotMainIndicator.className = 'status-dot-indicator online';
        statusDotMain.title = 'Server is running';
      }
      return true;
    } else {
      throw new Error('Server returned error');
    }
  } catch (error) {
    if (statusDot) {
      statusDot.className = 'status-dot offline';
      statusText.textContent = 'Server offline - See "How to start" below';
    }
    if (statusDotMainIndicator) {
      statusDotMainIndicator.className = 'status-dot-indicator offline';
      statusDotMain.title = 'Server offline - Click Settings for help';
    }
    return false;
  }
}

function showError(message) {
  if (message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  } else {
    errorMessage.classList.add('hidden');
  }
}
