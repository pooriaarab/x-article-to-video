import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

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
    charsPerFrame: number;
  };
}

export const TweetLofi: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#F4E4C1',
    secondary: '#E8A598',
    background: '#2D3561',
    accent: '#9D84B7'
  };

  const charsPerFrame = Math.max(0.5, timing?.charsPerFrame || 1.5);
  const textDelay = Math.max(0, timing?.textDelay || 20);

  // Typewriter effect
  const totalChars = tweetData.text.length;
  const visibleChars = Math.floor(
    interpolate(
      frame,
      [textDelay, textDelay + (totalChars / charsPerFrame)],
      [0, totalChars],
      { extrapolateRight: 'clamp' }
    )
  );

  const displayText = tweetData.text.slice(0, visibleChars);

  // Rain drops animation
  const raindrops = Array.from({ length: 50 }, (_, i) => {
    const x = (i * 37) % 100; // Distributed across width
    const speed = 2 + (i % 3);
    const y = ((frame * speed + i * 20) % 120) - 10;
    const opacity = 0.1 + (i % 3) * 0.05;

    return { x, y, opacity };
  });

  // Breathing/pulsing ambient light
  const ambientPulse = Math.sin(frame / 60) * 0.1 + 0.9;

  // Background image with lofi filter
  const bgImage = aiImages?.[0]?.url || tweetData.media?.[0]?.url;

  return (
    <AbsoluteFill style={{
      background: c.background,
      fontFamily: '"Courier New", monospace',
    }}>
      {/* Background with lofi effect */}
      {bgImage && (
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
        }}>
          <Img
            src={bgImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(10px) saturate(0.8) brightness(0.7)',
            }}
          />
        </div>
      )}

      {/* Rain effect */}
      <svg style={{ position: 'absolute', inset: 0 }}>
        {raindrops.map((drop, i) => (
          <line
            key={i}
            x1={`${drop.x}%`}
            y1={`${drop.y}%`}
            x2={`${drop.x}%`}
            y2={`${drop.y + 2}%`}
            stroke={c.accent}
            strokeWidth="1"
            opacity={drop.opacity}
          />
        ))}
      </svg>

      {/* Vinyl player decoration */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 40,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${c.background} 30%, ${c.accent} 31%, ${c.background} 35%, ${c.accent} 100%)`,
        opacity: ambientPulse,
        transform: `rotate(${frame * 2}deg)`,
        boxShadow: `0 0 30px ${c.accent}50`,
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: c.primary,
          transform: 'translate(-50%, -50%)',
        }} />
      </div>

      {/* Main content card */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 800,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: 20,
        padding: 50,
        border: `2px solid ${c.accent}40`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Text with typewriter effect */}
        <div style={{
          fontSize: 28,
          lineHeight: 1.8,
          color: c.primary,
          marginBottom: 30,
          minHeight: 150,
        }}>
          {displayText}
          {visibleChars < totalChars && (
            <span style={{
              opacity: Math.sin(frame / 10) * 0.5 + 0.5,
              marginLeft: 4,
            }}>
              |
            </span>
          )}
        </div>

        {/* Author section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          paddingTop: 20,
          borderTop: `1px solid ${c.accent}40`,
          opacity: interpolate(
            frame,
            [textDelay + (totalChars / charsPerFrame), textDelay + (totalChars / charsPerFrame) + 20],
            [0, 1],
            { extrapolateRight: 'clamp' }
          ),
        }}>
          {tweetData.author.profilePicUrl && (
            <Img
              src={tweetData.author.profilePicUrl}
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: `2px solid ${c.secondary}`,
                filter: 'grayscale(0.3)',
              }}
            />
          )}
          <div>
            <div style={{
              fontSize: 20,
              fontWeight: 600,
              color: c.secondary,
            }}>
              {tweetData.author.name}
            </div>
            <div style={{
              fontSize: 16,
              color: c.accent,
            }}>
              {tweetData.author.username}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        borderTop: `1px solid ${c.accent}40`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 15,
          fontSize: 16,
          color: c.primary,
        }}>
          <span>♪</span>
          <span>lofi beats to relax/study to</span>
        </div>
        <div style={{
          fontSize: 16,
          color: c.accent,
          fontFamily: 'monospace',
        }}>
          {Math.floor(frame / fps / 60)}:{String(Math.floor((frame / fps) % 60)).padStart(2, '0')}
        </div>
      </div>

      {/* Floating particles */}
      {Array.from({ length: 10 }, (_, i) => {
        const floatY = Math.sin((frame + i * 30) / 40) * 100 + 300;
        const floatX = ((frame / 2 + i * 100) % 1200) - 100;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: floatX,
              top: floatY,
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: c.accent,
              opacity: 0.3,
              boxShadow: `0 0 10px ${c.accent}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
