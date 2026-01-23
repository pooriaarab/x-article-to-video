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
    blockSpeed: number;
  };
}

export const TweetMinecraftParkour: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#FFFFFF',
    secondary: '#55FF55',
    background: '#87CEEB',
    accent: '#8B4513'
  };

  const blockSpeed = Math.max(1, timing?.blockSpeed || timing?.textDelay || 3);

  // Split text into words
  const words = (tweetData.text || '').split(' ');
  const currentWordIndex = Math.floor(frame / 25);
  const wordProgress = (frame % 25) / 25;

  // Minecraft blocks animation (bottom gameplay)
  const blocks = Array.from({ length: 8 }, (_, i) => {
    const x = ((i * 130 - frame * blockSpeed) % 1200) - 120;
    const type = i % 3; // Different block types
    const color = type === 0 ? '#8B4513' : type === 1 ? '#228B22' : '#A9A9A9';

    return { x, color, type };
  });

  // Text reveal word-by-word
  const currentWord = words[currentWordIndex % words.length] || '';
  const wordScale = interpolate(
    wordProgress,
    [0, 0.2, 1],
    [1.2, 1, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) }
  );

  // Player jump animation
  const playerY = interpolate(
    Math.sin(frame / 10) * 0.5 + 0.5,
    [0, 1],
    [0, -30],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* Top text area (70%) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
      }}>
        {/* Main text with Minecraft font style */}
        <div style={{
          fontSize: 56,
          fontWeight: 900,
          color: c.primary,
          fontFamily: 'monospace',
          textAlign: 'center',
          textShadow: `
            4px 4px 0 rgba(0,0,0,0.8),
            0 0 20px ${c.secondary}
          `,
          transform: `scale(${wordScale})`,
          lineHeight: 1.4,
        }}>
          {words.slice(0, currentWordIndex + 1).join(' ')}
        </div>

        {/* Author in Minecraft name tag style */}
        <div style={{
          marginTop: 40,
          background: 'rgba(0,0,0,0.7)',
          padding: '12px 24px',
          borderRadius: 8,
          border: `2px solid ${c.secondary}`,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: c.secondary,
            fontFamily: 'monospace',
            textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
          }}>
            {tweetData.author.name}
          </div>
        </div>
      </div>

      {/* Bottom gameplay area (30%) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))',
      }}>
        {/* Minecraft blocks */}
        {blocks.map((block, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: block.type === 1 ? 80 : 40,
              left: block.x,
              width: 100,
              height: 100,
              background: block.color,
              border: '4px solid rgba(0,0,0,0.3)',
              boxShadow: `
                inset -4px -4px 0 rgba(0,0,0,0.3),
                inset 4px 4px 0 rgba(255,255,255,0.3)
              `,
            }}
          />
        ))}

        {/* Player character (simple pixelated style) */}
        <div style={{
          position: 'absolute',
          bottom: 140 + playerY,
          left: '20%',
          width: 60,
          height: 80,
        }}>
          {/* Head */}
          <div style={{
            width: 40,
            height: 40,
            background: '#FFD9B3',
            border: '3px solid rgba(0,0,0,0.5)',
            marginLeft: 10,
            boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3)',
          }} />
          {/* Body */}
          <div style={{
            width: 40,
            height: 40,
            background: '#0099FF',
            border: '3px solid rgba(0,0,0,0.5)',
            marginLeft: 10,
            marginTop: -3,
            boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3)',
          }} />
        </div>

        {/* Health bar */}
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          display: 'flex',
          gap: 4,
        }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 24,
                background: i < 7 ? '#FF0000' : '#550000',
                border: '2px solid rgba(0,0,0,0.5)',
              }}
            />
          ))}
        </div>

        {/* Hotbar */}
        <div style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 4,
        }}>
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 50,
                height: 50,
                background: i === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.5)',
                border: '2px solid ' + (i === 0 ? c.secondary : 'rgba(255,255,255,0.5)'),
              }}
            />
          ))}
        </div>
      </div>

      {/* Crosshair */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 20,
        height: 20,
        transform: 'translate(-50%, -50%)',
      }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 2,
          height: 20,
          background: 'rgba(255,255,255,0.6)',
          transform: 'translateX(-50%)',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: 20,
          height: 2,
          background: 'rgba(255,255,255,0.6)',
          transform: 'translateY(-50%)',
        }} />
      </div>
    </AbsoluteFill>
  );
};
