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

export const TweetFortnite: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#FFC800',
    secondary: '#9D4EDD',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: '#00D9FF'
  };

  const wordDelay = Math.max(1, timing?.wordDelay || 2);

  // Split text into words
  const words = tweetData.text.split(' ');

  // Victory Royale style popup
  const victoryScale = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: {
      damping: 15,
      stiffness: 100,
    }
  });

  return (
    <AbsoluteFill style={{
      background: typeof c.background === 'string' && c.background.includes('gradient')
        ? c.background
        : c.background,
    }}>
      {/* Background grid */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Glowing particles */}
      {Array.from({ length: 20 }, (_, i) => {
        const particleX = ((i * 67 + frame * 2) % 120) - 10;
        const particleY = ((i * 43 + frame) % 120) - 10;
        const size = 4 + (i % 3) * 2;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${particleX}%`,
              top: `${particleY}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: i % 2 === 0 ? c.primary : c.accent,
              boxShadow: `0 0 15px ${i % 2 === 0 ? c.primary : c.accent}`,
              opacity: 0.6,
            }}
          />
        );
      })}

      {/* Main text with Fortnite style */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
      }}>
        <div style={{
          fontSize: 52,
          fontWeight: 900,
          lineHeight: 1.4,
          color: '#FFFFFF',
          fontFamily: 'Impact, sans-serif',
          textAlign: 'center',
          textTransform: 'uppercase',
          maxWidth: 900,
          textShadow: `
            4px 4px 0 ${c.secondary},
            8px 8px 0 #000000,
            0 0 30px ${c.primary}
          `,
          WebkitTextStroke: '2px #000000',
        }}>
          {words.map((word, idx) => {
            const wordFrame = frame - (idx * wordDelay);
            const wordSpring = spring({
              frame: Math.max(0, wordFrame),
              fps,
              config: {
                damping: 12,
                stiffness: 150,
              }
            });

            const wordScale = interpolate(wordSpring, [0, 1], [0, 1]);
            const wordRotate = interpolate(wordSpring, [0, 1], [90, 0]);

            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  marginRight: 14,
                  transform: `scale(${wordScale}) rotate(${wordRotate}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* "Victory Royale" style banner */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: '50%',
        transform: `translateX(-50%) scale(${victoryScale})`,
        opacity: victoryScale,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`,
          padding: '20px 60px',
          borderRadius: 10,
          fontSize: 36,
          fontWeight: 900,
          color: '#FFFFFF',
          fontFamily: 'Impact, sans-serif',
          textTransform: 'uppercase',
          textShadow: '4px 4px 0 #000000',
          WebkitTextStroke: '2px #000000',
          border: '4px solid #000000',
          boxShadow: `
            0 0 0 4px ${c.secondary},
            0 10px 30px rgba(0,0,0,0.5)
          `,
        }}>
          LEGENDARY
        </div>
      </div>

      {/* Player card (author) */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: 60,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        border: `4px solid ${c.primary}`,
        borderRadius: 15,
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: `
          0 0 20px ${c.primary}50,
          inset 0 0 20px rgba(255,255,255,0.1)
        `,
        opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        {tweetData.author.profilePicUrl && (
          <div style={{
            position: 'relative',
          }}>
            <Img
              src={tweetData.author.profilePicUrl}
              style={{
                width: 70,
                height: 70,
                borderRadius: 10,
                border: `3px solid ${c.accent}`,
              }}
            />
            {/* Level badge */}
            <div style={{
              position: 'absolute',
              top: -10,
              right: -10,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: c.secondary,
              border: '3px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 900,
              color: '#FFFFFF',
              fontFamily: 'Impact, sans-serif',
            }}>
              99
            </div>
          </div>
        )}
        <div>
          <div style={{
            fontSize: 24,
            fontWeight: 900,
            color: c.primary,
            fontFamily: 'Impact, sans-serif',
            textShadow: '2px 2px 0 #000000',
          }}>
            {tweetData.author.name}
          </div>
          <div style={{
            fontSize: 16,
            color: c.accent,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
          }}>
            {tweetData.author.username}
          </div>
        </div>
      </div>

      {/* Elimination counter (fake) */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 40,
        background: 'rgba(0,0,0,0.8)',
        border: `3px solid ${c.accent}`,
        borderRadius: 10,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          fontSize: 28,
          fontWeight: 900,
          color: c.primary,
          fontFamily: 'Impact, sans-serif',
        }}>
          {Math.floor(frame / 10)}
        </div>
        <div style={{
          fontSize: 16,
          color: '#FFFFFF',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 700,
        }}>
          ELIMS
        </div>
      </div>

      {/* Corner accent decorations */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...pos,
            width: 40,
            height: 40,
            border: `4px solid ${c.primary}`,
            borderRadius: 8,
            opacity: 0.3,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
