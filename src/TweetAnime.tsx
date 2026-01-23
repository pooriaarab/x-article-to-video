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
    charsPerFrame: number;
  };
}

export const TweetAnime: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#FF1744',
    secondary: '#2979FF',
    background: '#FFF3E0',
    accent: '#FFD600'
  };

  const charsPerFrame = Math.max(0.5, timing?.charsPerFrame || 2);
  const textDelay = Math.max(0, timing?.textDelay || 20);

  // Speed lines animation
  const speedLines = Array.from({ length: 25 }, (_, i) => {
    const angle = (i / 25) * 360;
    const length = interpolate(
      (frame + i * 2) % 30,
      [0, 15, 30],
      [0, 800, 0],
      { extrapolateRight: 'clamp' }
    );

    return { angle, length };
  });

  // Character by character reveal with shake effect
  const totalChars = tweetData.text.length;
  const visibleChars = Math.floor(
    interpolate(
      frame,
      [textDelay, textDelay + (totalChars / charsPerFrame)],
      [0, totalChars],
      { extrapolateRight: 'clamp' }
    )
  );

  // Dramatic shake on new char
  const shakeX = (frame % 2 === 0 && visibleChars < totalChars) ? (Math.random() - 0.5) * 4 : 0;
  const shakeY = (frame % 2 === 0 && visibleChars < totalChars) ? (Math.random() - 0.5) * 4 : 0;

  // Background image with anime filter
  const bgImage = aiImages?.[0]?.url || tweetData.media?.[0]?.url;

  // Sweat drop animation
  const sweatDrop = spring({
    frame: frame % 40,
    fps,
    config: {
      damping: 30,
      stiffness: 200,
    }
  });

  const sweatY = interpolate(sweatDrop, [0, 1], [0, 50]);

  return (
    <AbsoluteFill style={{
      background: c.background,
      fontFamily: '"Arial Black", sans-serif',
    }}>
      {/* Background with anime filter */}
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
              filter: 'saturate(1.5) contrast(1.2)',
            }}
          />
        </div>
      )}

      {/* Speed lines radiating from center */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}>
        {speedLines.map((line, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 4,
              height: line.length,
              background: `linear-gradient(to bottom, ${c.secondary}80, transparent)`,
              transformOrigin: 'top center',
              transform: `rotate(${line.angle}deg)`,
            }}
          />
        ))}
      </div>

      {/* Main text panel */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}>
        {/* Text box with anime style */}
        <div style={{
          background: '#FFFFFF',
          border: `6px solid ${c.primary}`,
          borderRadius: 20,
          padding: 40,
          maxWidth: 800,
          position: 'relative',
          boxShadow: `
            0 0 0 4px #000000,
            8px 8px 0 4px #000000
          `,
        }}>
          <div style={{
            fontSize: 36,
            lineHeight: 1.6,
            color: '#000000',
            fontWeight: 900,
          }}>
            {tweetData.text.slice(0, visibleChars)}
            {visibleChars < totalChars && (
              <span style={{
                opacity: Math.sin(frame / 10) * 0.5 + 0.5,
              }}>
                ▌
              </span>
            )}
          </div>

          {/* Anime sweat drop */}
          {frame > textDelay && (
            <div style={{
              position: 'absolute',
              top: -20 + sweatY,
              right: 40,
              width: 20,
              height: 30,
              background: c.secondary,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              border: '2px solid #000000',
              opacity: sweatDrop,
            }} />
          )}
        </div>

        {/* Manga-style action lines */}
        {visibleChars < totalChars && (
          <div style={{
            position: 'absolute',
            top: '30%',
            right: 100,
            fontSize: 80,
            fontWeight: 900,
            color: c.primary,
            textShadow: `
              4px 4px 0 #000000,
              0 0 20px ${c.accent}
            `,
            WebkitTextStroke: '2px #000000',
            transform: `rotate(-15deg) scale(${1 + Math.sin(frame / 5) * 0.1})`,
          }}>
            !!!
          </div>
        )}
      </div>

      {/* Author in anime name card */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#FFFFFF',
        border: `5px solid ${c.secondary}`,
        borderRadius: 15,
        padding: '15px 30px',
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        boxShadow: `
          0 0 0 3px #000000,
          6px 6px 0 3px #000000
        `,
        opacity: interpolate(frame, [textDelay + (totalChars / charsPerFrame), textDelay + (totalChars / charsPerFrame) + 20], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        {tweetData.author.profilePicUrl && (
          <Img
            src={tweetData.author.profilePicUrl}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              border: `4px solid ${c.primary}`,
              filter: 'saturate(1.3) contrast(1.1)',
            }}
          />
        )}
        <div>
          <div style={{
            fontSize: 20,
            fontWeight: 900,
            color: c.primary,
          }}>
            {tweetData.author.name}
          </div>
          <div style={{
            fontSize: 14,
            color: '#666',
            fontWeight: 700,
          }}>
            {tweetData.author.username}
          </div>
        </div>
      </div>

      {/* Cherry blossoms falling */}
      {Array.from({ length: 10 }, (_, i) => {
        const fallX = ((i * 117 + frame * 2) % 120) - 10;
        const fallY = ((frame * (1 + i * 0.1) + i * 100) % 120) - 10;
        const rotate = (frame + i * 30) * 3;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${fallX}%`,
              top: `${fallY}%`,
              width: 15,
              height: 15,
              background: c.accent,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              transform: `rotate(${rotate}deg)`,
              opacity: 0.6,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
