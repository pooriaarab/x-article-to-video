import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface TweetData {
  text: string;
  author: {
    name: string;
    username: string;
    profilePicUrl: string;
  };
  media?: Array<{ type: string; url: string }>;
}

interface Props {
  tweetData: TweetData;
  durationInFrames?: number;
  aiImages?: Array<{ url: string; startFrame: number }>;
  colors?: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
  timing?: {
    textDelay: number;
    imageDelay: number;
    charsPerFrame: number;
  };
}

export const TweetTerminal: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDuration } = useVideoConfig();

  // Debug logging (only on first frame)
  if (frame === 0) {
    console.log('💻 TweetTerminal rendering with props:', {
      durationProp: durationInFrames,
      configDuration: configDuration,
      hasAiImages: !!aiImages,
      aiImagesCount: aiImages?.length || 0,
      hasCustomColors: !!colors,
      hasCustomTiming: !!timing
    });
  }

  // Default values
  const c = colors || {
    primary: '#00FF00',
    secondary: '#FFFFFF',
    background: '#000000',
    accent: '#00FF00'
  };

  const t = timing || {
    textDelay: 0,
    imageDelay: 70,
    charsPerFrame: 2
  };

  // Typewriter effect
  const totalChars = `${tweetData.author.name || ''} ${tweetData.author.username || ''}

${tweetData.text || ''}`.length;

  // Ensure charsPerFrame is valid
  const safeCharsPerFrame = Math.max(0.5, t.charsPerFrame || 2);
  const typewriterDuration = Math.max(10, totalChars / safeCharsPerFrame);

  const visibleChars = Math.floor(
    interpolate(
      frame,
      [t.textDelay, t.textDelay + typewriterDuration],
      [0, totalChars],
      { extrapolateRight: 'clamp' }
    )
  );

  const authorText = `${tweetData.author.name} ${tweetData.author.username}`;
  const fullText = `${authorText}\n\n${tweetData.text}`;
  const displayedText = fullText.slice(0, visibleChars);

  // Cursor blink
  const cursorOpacity = interpolate(
    frame % 20,
    [0, 10],
    [1, 0],
    { extrapolateRight: 'clamp' }
  );

  const showCursor = visibleChars < totalChars;

  return (
    <AbsoluteFill
      style={{
        background: c.background,
        padding: 40,
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: 20,
        color: c.primary,
        lineHeight: 1.6
      }}
    >
      {/* AI Generated Images with Glitch Effect */}
      {aiImages && aiImages.map((img, idx) => {
        const showStart = img.startFrame;
        const showEnd = img.startFrame + 75;

        const isVisible = frame >= showStart && frame <= showEnd;

        // Glitch effect
        const glitchOffset = (frame % 5 === 0) ? Math.random() * 20 - 10 : 0;
        const scanlineOpacity = interpolate(frame % 30, [0, 15, 30], [0.1, 0.3, 0.1]);

        if (!isVisible) return null;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              right: 40,
              bottom: 100 + (idx * 20),
              width: 180,
              height: 120,
              border: `2px solid ${c.accent}`,
              overflow: 'hidden',
              opacity: 0.7,
              transform: `translateX(${glitchOffset}px)`,
            }}
          >
            <Img
              src={img.url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(1) contrast(1.2)',
                mixBlendMode: 'screen',
              }}
            />
            {/* Scanline effect */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `repeating-linear-gradient(
                0deg,
                ${c.accent}20 0px,
                transparent 2px,
                transparent 4px
              )`,
              opacity: scanlineOpacity,
            }} />
          </div>
        );
      })}

      {/* Terminal header */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 30,
          paddingBottom: 20,
          borderBottom: `1px solid ${c.accent}`
        }}
      >
        <div style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#FF5F57'
        }} />
        <div style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#FEBC2E'
        }} />
        <div style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#28C840'
        }} />
        <div style={{
          marginLeft: 20,
          color: c.secondary,
          fontSize: 14
        }}>
          tweet.sh
        </div>
      </div>

      {/* Terminal prompt */}
      <div style={{ marginBottom: 20 }}>
        <span style={{ color: c.accent }}>$</span>
        <span style={{ color: c.secondary }}> cat tweet.txt</span>
      </div>

      {/* Tweet content */}
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {displayedText}
        {showCursor && (
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 24,
              background: c.primary,
              marginLeft: 2,
              opacity: cursorOpacity
            }}
          />
        )}
      </div>

      {/* Media indicator */}
      {tweetData.media && tweetData.media.length > 0 && (
        <div
          style={{
            marginTop: 30,
            padding: 15,
            border: `1px solid ${c.accent}`,
            borderRadius: 4,
            opacity: frame > t.imageDelay ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        >
          <div style={{ color: c.secondary, fontSize: 16 }}>
            📎 Attachments: {tweetData.media.length} file{tweetData.media.length > 1 ? 's' : ''}
          </div>
          {tweetData.media.map((item, index) => (
            <div
              key={index}
              style={{
                marginTop: 8,
                color: c.primary,
                fontSize: 14
              }}
            >
              {index + 1}. {item.type}.{item.type === 'image' ? 'jpg' : 'mp4'}
            </div>
          ))}
        </div>
      )}

      {/* Footer prompt */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          opacity: visibleChars >= totalChars ? 1 : 0
        }}
      >
        <span style={{ color: c.accent }}>$</span>
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 20,
            background: c.primary,
            marginLeft: 8,
            opacity: cursorOpacity
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
