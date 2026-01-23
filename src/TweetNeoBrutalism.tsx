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
  durationInFrames?: number;
  tweetData: TweetData;
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

export const TweetNeoBrutalism: React.FC<Props> = ({ tweetData, durationInFrames, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Neo-Brutalism colors (high contrast, bold colors)
  const c = colors || {
    primary: '#000000',
    secondary: '#FFFF00',
    background: '#00FF00',
    accent: '#FF00FF'
  };

  const t = timing || {
    textDelay: 18,
    imageDelay: 60,
    wordDelay: 2.5
  };

  // Split text into words
  const words = tweetData.text.split(' ');
  const totalWords = words.length;

  // Jittery, stop-motion style animation
  const jitterAmount = 3;
  const jitterX = Math.floor(Math.random() * jitterAmount) - jitterAmount / 2;
  const jitterY = Math.floor(Math.random() * jitterAmount) - jitterAmount / 2;

  // Avatar slam-in effect
  const avatarSlam = interpolate(
    frame,
    [5, 15],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  );

  const avatarRotation = interpolate(
    frame,
    [5, 15],
    [-15, 0],
    { extrapolateRight: 'clamp' }
  );

  // Word reveal with harsh, instant transitions (step effect)
  const visibleWords = Math.floor(interpolate(
    frame,
    [t.textDelay, t.textDelay + totalWords * t.wordDelay],
    [0, totalWords],
    { extrapolateRight: 'clamp' }
  ));

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* Grid lines (neo-brutalist aesthetic) */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', opacity: 0.15 }}
      >
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={c.primary} strokeWidth="2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Harsh shadow boxes (floating geometric shapes) */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          right: 120,
          width: 200,
          height: 200,
          background: c.accent,
          border: `6px solid ${c.primary}`,
          transform: `rotate(${frame * 0.5}deg)`,
          boxShadow: `8px 8px 0px ${c.primary}`
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 150,
          left: 80,
          width: 150,
          height: 150,
          background: c.secondary,
          border: `6px solid ${c.primary}`,
          transform: `rotate(${-frame * 0.3}deg)`,
          boxShadow: `8px 8px 0px ${c.primary}`
        }}
      />

      {/* Author avatar with thick border */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 80,
          transform: `scale(${avatarSlam}) rotate(${avatarRotation}deg) translate(${jitterX}px, ${jitterY}px)`,
          zIndex: 3
        }}
      >
        {tweetData.author.profilePicUrl && (
          <Img
            src={tweetData.author.profilePicUrl}
            style={{
              width: 160,
              height: 160,
              border: `8px solid ${c.primary}`,
              objectFit: 'cover',
              boxShadow: `12px 12px 0px ${c.primary}`
            }}
          />
        )}

        {/* Username label with harsh styling */}
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: -8,
            background: c.secondary,
            padding: '8px 20px',
            border: `4px solid ${c.primary}`,
            fontSize: 18,
            fontWeight: 900,
            color: c.primary,
            textTransform: 'uppercase',
            fontFamily: 'Impact, Arial Black, sans-serif',
            boxShadow: `6px 6px 0px ${c.primary}`,
            whiteSpace: 'nowrap'
          }}
        >
          {tweetData.author.username}
        </div>
      </div>

      {/* Main text - harsh, blocky, all caps */}
      <div
        style={{
          position: 'absolute',
          top: 360,
          left: 80,
          right: 80,
          transform: `translate(${jitterX}px, ${jitterY}px)`,
          zIndex: 2
        }}
      >
        <div
          style={{
            background: c.secondary,
            padding: '32px',
            border: `8px solid ${c.primary}`,
            boxShadow: `16px 16px 0px ${c.primary}`
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              lineHeight: 1.2,
              color: c.primary,
              textTransform: 'uppercase',
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '1px',
              wordSpacing: '8px'
            }}
          >
            {words.slice(0, visibleWords).map((word, index) => {
              // Random color for some words
              const isColorWord = index % 4 === 2;
              const wordColor = isColorWord ? c.accent : c.primary;

              return (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    marginRight: 12,
                    marginBottom: 12,
                    color: wordColor,
                    textShadow: isColorWord ? `4px 4px 0px ${c.primary}` : 'none'
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decorative harsh corners */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          width: 60,
          height: 60,
          borderTop: `8px solid ${c.primary}`,
          borderLeft: `8px solid ${c.primary}`
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 30,
          right: 30,
          width: 60,
          height: 60,
          borderTop: `8px solid ${c.primary}`,
          borderRight: `8px solid ${c.primary}`
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 30,
          width: 60,
          height: 60,
          borderBottom: `8px solid ${c.primary}`,
          borderLeft: `8px solid ${c.primary}`
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderBottom: `8px solid ${c.primary}`,
          borderRight: `8px solid ${c.primary}`
        }}
      />

      {/* "RAW" label in corner */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          right: 80,
          background: c.accent,
          padding: '16px 32px',
          border: `6px solid ${c.primary}`,
          fontSize: 36,
          fontWeight: 900,
          color: c.primary,
          fontFamily: 'Impact, sans-serif',
          textTransform: 'uppercase',
          boxShadow: `10px 10px 0px ${c.primary}`,
          opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' }),
          transform: `rotate(-5deg) translate(${jitterX * 2}px, ${jitterY * 2}px)`
        }}
      >
        RAW
      </div>
    </AbsoluteFill>
  );
};
