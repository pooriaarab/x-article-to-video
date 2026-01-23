import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";

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
    wordDelay: number;
  };
}

export const TweetNeon: React.FC<Props> = ({ tweetData, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Default cyberpunk neon colors
  const c = colors || {
    primary: '#FF006E',
    secondary: '#00F0FF',
    background: '#0A0E27',
    accent: '#8B5CF6'
  };

  const t = timing || {
    textDelay: 20,
    imageDelay: 80,
    wordDelay: 2
  };

  // Split text into words
  const words = tweetData.text.split(' ');

  // Scan line effect
  const scanLineY = interpolate(frame, [0, 180], [0, 1080], { extrapolateRight: 'wrap' });

  // Grid flicker effect
  const gridOpacity = interpolate(
    Math.sin(frame * 0.5),
    [-1, 1],
    [0.02, 0.08]
  );

  // Author animation with neon glow
  const authorSpring = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 200,
      stiffness: 100
    }
  });

  const authorOpacity = interpolate(authorSpring, [0, 1], [0, 1]);

  // Flicker effect for author
  const authorFlicker = frame < 30 && frame % 3 === 0 ? 0.7 : 1;

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* Cyberpunk grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${c.secondary}22 1px, transparent 1px),
            linear-gradient(90deg, ${c.secondary}22 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: gridOpacity,
          transform: 'perspective(500px) rotateX(60deg) translateY(-200px)'
        }}
      />

      {/* Scan line effect */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scanLineY,
          height: 2,
          background: `linear-gradient(to bottom, transparent, ${c.secondary}80, transparent)`,
          boxShadow: `0 0 20px ${c.secondary}`,
          opacity: 0.5
        }}
      />

      {/* AI Generated Images with Neon Glow */}
      {aiImages && aiImages.map((img, idx) => {
        const showStart = img.startFrame;
        const showEnd = img.startFrame + 80;

        if (frame < showStart || frame > showEnd) return null;

        const imageOpacity = interpolate(
          frame,
          [showStart, showStart + 10, showEnd - 10, showEnd],
          [0, 1, 1, 0],
          { extrapolateRight: 'clamp' }
        );

        // Pulsing glow
        const glowIntensity = interpolate(
          Math.sin((frame - showStart) * 0.3),
          [-1, 1],
          [0.5, 1]
        );

        const positions = [
          { top: 180, left: 80 },
          { top: 180, right: 80 },
          { bottom: 180, left: '50%', transform: 'translateX(-50%)' }
        ];

        const pos = positions[idx % positions.length];

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              ...pos,
              width: 220,
              height: 150,
              opacity: imageOpacity,
            }}
          >
            <Img
              src={img.url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 8,
                border: `2px solid ${c.primary}`,
                boxShadow: `
                  0 0 ${20 * glowIntensity}px ${c.primary},
                  inset 0 0 ${15 * glowIntensity}px ${c.primary}40
                `,
                filter: `saturate(1.5) contrast(1.1)`,
              }}
            />
          </div>
        );
      })}

      {/* Corner frame decorations */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          width: 100,
          height: 100,
          borderTop: `3px solid ${c.primary}`,
          borderLeft: `3px solid ${c.primary}`,
          boxShadow: `0 0 20px ${c.primary}`,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 30,
          right: 30,
          width: 100,
          height: 100,
          borderTop: `3px solid ${c.secondary}`,
          borderRight: `3px solid ${c.secondary}`,
          boxShadow: `0 0 20px ${c.secondary}`,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 30,
          width: 100,
          height: 100,
          borderBottom: `3px solid ${c.accent}`,
          borderLeft: `3px solid ${c.accent}`,
          boxShadow: `0 0 20px ${c.accent}`,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 100,
          height: 100,
          borderBottom: `3px solid ${c.primary}`,
          borderRight: `3px solid ${c.primary}`,
          boxShadow: `0 0 20px ${c.primary}`,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
        }}
      />

      {/* Content container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 100,
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Author section with neon glow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 50,
            opacity: authorOpacity * authorFlicker
          }}
        >
          {tweetData.author.profilePicUrl && (
            <div
              style={{
                position: 'relative'
              }}
            >
              {/* Neon glow rings */}
              <div
                style={{
                  position: 'absolute',
                  inset: -8,
                  background: `conic-gradient(from 0deg, ${c.primary}, ${c.secondary}, ${c.accent}, ${c.primary})`,
                  borderRadius: '50%',
                  filter: 'blur(15px)',
                  opacity: 0.8,
                  animation: 'spin 3s linear infinite'
                }}
              />
              <Img
                src={tweetData.author.profilePicUrl}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  position: 'relative',
                  border: `3px solid ${c.secondary}`,
                  boxShadow: `0 0 30px ${c.secondary}`
                }}
              />
            </div>
          )}
          <div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: c.primary,
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                textShadow: `
                  0 0 10px ${c.primary},
                  0 0 20px ${c.primary},
                  0 0 30px ${c.primary}
                `,
                letterSpacing: 2
              }}
            >
              {tweetData.author.name}
            </div>
            <div
              style={{
                fontSize: 20,
                color: c.secondary,
                fontFamily: 'monospace',
                fontWeight: 700,
                textShadow: `0 0 10px ${c.secondary}`
              }}
            >
              {tweetData.author.username}
            </div>
          </div>
        </div>

        {/* Neon text with word-by-word flicker animation */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 16,
            maxWidth: 750,
            marginBottom: tweetData.media && tweetData.media.length > 0 ? 50 : 0
          }}
        >
          {words.map((word, index) => {
            const wordStartFrame = t.textDelay + (index * t.wordDelay);

            // Flicker effect on appearance
            const flickerFrames = [wordStartFrame, wordStartFrame + 2, wordStartFrame + 5, wordStartFrame + 7];
            const isFlickerFrame = flickerFrames.includes(Math.floor(frame));
            const flickerOpacity = frame < wordStartFrame + 10 && isFlickerFrame ? 0.3 : 1;

            const wordOpacity = interpolate(
              frame,
              [wordStartFrame, wordStartFrame + 10],
              [0, 1],
              { extrapolateRight: 'clamp' }
            );

            // Glow intensity pulsates
            const glowIntensity = interpolate(
              Math.sin(frame * 0.1 + index),
              [-1, 1],
              [0.5, 1]
            );

            // Cycle through neon colors
            const colorIndex = index % 3;
            const neonColors = [c.primary, c.secondary, c.accent];
            const wordColor = neonColors[colorIndex];

            return (
              <span
                key={index}
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: wordColor,
                  fontFamily: 'monospace',
                  display: 'inline-block',
                  opacity: wordOpacity * flickerOpacity,
                  textShadow: `
                    0 0 10px ${wordColor},
                    0 0 20px ${wordColor},
                    0 0 40px ${wordColor},
                    0 0 80px ${wordColor}
                  `,
                  filter: `brightness(${glowIntensity})`,
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Media with neon border */}
        {tweetData.media && tweetData.media.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: tweetData.media.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              gap: 24,
              opacity: interpolate(
                frame,
                [t.imageDelay, t.imageDelay + 20],
                [0, 1],
                { extrapolateRight: 'clamp' }
              ),
              transform: `scale(${interpolate(
                frame,
                [t.imageDelay, t.imageDelay + 20],
                [0.8, 1],
                { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
              )})`
            }}
          >
            {tweetData.media.map((item, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Neon border glow */}
                <div
                  style={{
                    position: 'absolute',
                    inset: -4,
                    background: `linear-gradient(135deg, ${c.primary}, ${c.secondary}, ${c.accent})`,
                    filter: 'blur(10px)',
                    opacity: 0.8
                  }}
                />
                <Img
                  src={item.url}
                  style={{
                    width: tweetData.media!.length === 1 ? 400 : 280,
                    height: tweetData.media!.length === 1 ? 300 : 220,
                    objectFit: 'cover',
                    position: 'relative',
                    border: `2px solid ${index % 2 === 0 ? c.primary : c.secondary}`,
                    boxShadow: `0 0 30px ${index % 2 === 0 ? c.primary : c.secondary}`
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom neon bar with animation */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${c.primary}, ${c.secondary}, ${c.accent}, ${c.primary})`,
          backgroundSize: '200% 100%',
          boxShadow: `0 0 20px ${c.primary}`,
          animation: 'gradient-shift 2s linear infinite'
        }}
      />

      {/* Noise texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABnSURBVHja7NZBDYAwEATBfk1MoAQLegAL1gQSLA1XkJAL7GeSmX+Nw6+VuEAAAQAIAEAAAAAAgJaZK6pqZu71uQAAAIDfMvdoAAAAgLkHAgAAYO4xAwAAAHOvAwAAgJlnEgAAAIAHAQCfIzDhoAkbAAAAAElFTkSuQmCC)',
          opacity: 0.03,
          pointerEvents: 'none',
          mixBlendMode: 'overlay'
        }}
      />
    </AbsoluteFill>
  );
};
