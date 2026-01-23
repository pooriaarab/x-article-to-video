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
    wordDelay: number;
  };
}

export const TweetDisney: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#FFD700',
    secondary: '#FF69B4',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    accent: '#00CED1'
  };

  const wordDelay = Math.max(1, timing?.wordDelay || 3);

  // Split text into words
  const words = tweetData.text.split(' ');

  // Magical sparkles
  const sparkles = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * Math.PI * 2 + frame / 20;
    const distance = 200 + Math.sin(frame / 30 + i) * 50;
    const x = 540 + Math.cos(angle) * distance;
    const y = 540 + Math.sin(angle) * distance;
    const scale = Math.sin(frame / 15 + i) * 0.5 + 1;
    const opacity = Math.sin(frame / 20 + i) * 0.5 + 0.5;

    return { x, y, scale, opacity };
  });

  return (
    <AbsoluteFill style={{
      background: typeof c.background === 'string' && c.background.includes('gradient')
        ? c.background
        : c.background,
    }}>
      {/* Magical sparkles */}
      {sparkles.map((sparkle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: sparkle.x,
            top: sparkle.y,
            width: 20,
            height: 20,
            transform: `scale(${sparkle.scale})`,
            opacity: sparkle.opacity,
          }}
        >
          <svg viewBox="0 0 24 24" fill={i % 2 === 0 ? c.primary : c.secondary}>
            <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4L12 0z" />
          </svg>
        </div>
      ))}

      {/* Castle silhouette at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        background: `linear-gradient(to top, rgba(0,0,0,0.6), transparent)`,
      }}>
        <svg
          viewBox="0 0 1080 200"
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            fill: 'rgba(0,0,0,0.8)',
          }}
        >
          {/* Simple castle shape */}
          <path d="M0,200 L0,150 L100,150 L100,100 L150,100 L150,50 L200,50 L200,100 L300,100 L300,150 L500,150 L500,120 L540,80 L580,120 L580,150 L780,150 L780,100 L830,100 L830,50 L880,50 L880,100 L980,100 L980,150 L1080,150 L1080,200 Z" />
        </svg>
      </div>

      {/* Main text with Disney-style presentation */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}>
        <div style={{
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1.6,
          color: '#FFFFFF',
          fontFamily: 'Georgia, serif',
          textAlign: 'center',
          textShadow: `
            3px 3px 0 rgba(0,0,0,0.5),
            0 0 40px ${c.primary}
          `,
          maxWidth: 800,
        }}>
          {words.map((word, idx) => {
            const wordFrame = frame - (idx * wordDelay);
            const wordSpring = spring({
              frame: Math.max(0, wordFrame),
              fps,
              config: {
                damping: 12,
                stiffness: 120,
                mass: 0.5,
              }
            });

            const wordScale = interpolate(wordSpring, [0, 1], [0, 1]);
            const wordRotate = interpolate(wordSpring, [0, 1], [-180, 0]);

            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  marginRight: 12,
                  transform: `scale(${wordScale}) rotate(${wordRotate}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Fairy dust trail */}
        {Array.from({ length: 15 }, (_, i) => {
          const trailX = 100 + (frame * 5 - i * 20) % 1080;
          const trailY = 200 + Math.sin((frame - i * 5) / 20) * 100;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: trailX,
                top: trailY,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: c.primary,
                opacity: 0.6 - (i * 0.04),
                boxShadow: `0 0 15px ${c.primary}`,
              }}
            />
          );
        })}
      </div>

      {/* Author in magical scroll */}
      <div style={{
        position: 'absolute',
        bottom: 220,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 40,
        padding: '20px 40px',
        border: `4px solid ${c.primary}`,
        boxShadow: `
          0 10px 40px rgba(0,0,0,0.4),
          inset 0 0 20px ${c.primary}50
        `,
        opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          {tweetData.author.profilePicUrl && (
            <Img
              src={tweetData.author.profilePicUrl}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                border: `3px solid ${c.secondary}`,
              }}
            />
          )}
          <div>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: c.secondary,
              fontFamily: 'Georgia, serif',
            }}>
              {tweetData.author.name}
            </div>
            <div style={{
              fontSize: 16,
              color: '#666',
              fontFamily: 'Georgia, serif',
            }}>
              {tweetData.author.username}
            </div>
          </div>
        </div>
      </div>

      {/* Disney-style star wipe transition at start */}
      {frame < 30 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          clipPath: `polygon(50% 50%, 50% ${100 - (frame / 30) * 100}%, 100% ${100 - (frame / 30) * 100}%, 100% 100%, 0 100%, 0 ${100 - (frame / 30) * 100}%)`,
          background: '#000000',
        }} />
      )}
    </AbsoluteFill>
  );
};
