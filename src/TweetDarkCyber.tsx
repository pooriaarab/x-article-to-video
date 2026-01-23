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

export const TweetDarkCyber: React.FC<Props> = ({ tweetData, durationInFrames, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dark mode cyber colors
  const c = colors || {
    primary: '#FFFFFF',
    secondary: '#00FFFF',
    background: '#121212',
    accent: '#FF00FF'
  };

  const t = timing || {
    textDelay: 20,
    imageDelay: 70,
    wordDelay: 2.5
  };

  // Split text into words
  const words = tweetData.text.split(' ');
  const totalWords = words.length;

  // Smooth word reveal
  const visibleWords = Math.min(
    totalWords,
    Math.floor(interpolate(
      frame,
      [t.textDelay, t.textDelay + totalWords * t.wordDelay],
      [0, totalWords],
      { extrapolateRight: 'clamp' }
    ))
  );

  // Avatar fade and glow
  const avatarOpacity = interpolate(
    frame,
    [5, 25],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  // Pulsing glow effect
  const glowIntensity = interpolate(
    Math.sin(frame / 20),
    [-1, 1],
    [0.3, 1]
  );

  // Scanning line effect
  const scanLineY = interpolate(
    frame % 120,
    [0, 120],
    [0, 1080],
    { extrapolateRight: 'wrap' }
  );

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* Grid overlay (cyber aesthetic) */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', opacity: 0.08 }}
      >
        <defs>
          <pattern id="cyber-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={c.secondary} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-grid)" />
      </svg>

      {/* Scanning line */}
      <div
        style={{
          position: 'absolute',
          top: scanLineY,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${c.secondary}80, transparent)`,
          boxShadow: `0 0 20px ${c.secondary}`,
          zIndex: 10
        }}
      />

      {/* Glowing corner accents */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 300,
          height: 300,
          background: `radial-gradient(circle at 0% 0%, ${c.secondary}15, transparent 70%)`,
          opacity: glowIntensity
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 300,
          height: 300,
          background: `radial-gradient(circle at 100% 100%, ${c.accent}15, transparent 70%)`,
          opacity: glowIntensity
        }}
      />

      {/* Author avatar with cyber glow */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: avatarOpacity,
          zIndex: 3
        }}
      >
        {tweetData.author.profilePicUrl && (
          <div style={{ position: 'relative' }}>
            {/* Glow layer */}
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: -10,
                right: -10,
                bottom: -10,
                background: `radial-gradient(circle, ${c.secondary}60, transparent 70%)`,
                filter: 'blur(15px)',
                opacity: glowIntensity
              }}
            />

            <Img
              src={tweetData.author.profilePicUrl}
              style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                border: `3px solid ${c.secondary}`,
                objectFit: 'cover',
                position: 'relative',
                boxShadow: `0 0 30px ${c.secondary}80, inset 0 0 20px rgba(0,0,0,0.5)`
              }}
            />

            {/* Hexagon overlay effect */}
            <svg
              width="160"
              height="160"
              style={{
                position: 'absolute',
                top: -10,
                left: -10,
                pointerEvents: 'none'
              }}
              viewBox="0 0 100 100"
            >
              <polygon
                points="50,5 90,30 90,70 50,95 10,70 10,30"
                fill="none"
                stroke={c.secondary}
                strokeWidth="1"
                opacity="0.5"
              />
            </svg>
          </div>
        )}

        {/* Username with glow */}
        <div
          style={{
            marginTop: 20,
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 600,
            color: c.secondary,
            textShadow: `0 0 10px ${c.secondary}80`,
            fontFamily: 'monospace',
            letterSpacing: '2px'
          }}
        >
          {tweetData.author.username}
        </div>
      </div>

      {/* Main text with cyber aesthetic */}
      <div
        style={{
          position: 'absolute',
          top: 340,
          left: 80,
          right: 80,
          zIndex: 2
        }}
      >
        {/* Container with border glow */}
        <div
          style={{
            background: 'rgba(18, 18, 18, 0.8)',
            border: `1px solid ${c.secondary}40`,
            borderRadius: 8,
            padding: '32px',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 40px ${c.secondary}20, inset 0 0 20px rgba(0,0,0,0.5)`
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 300,
              lineHeight: 1.4,
              color: c.primary,
              fontFamily: 'SF Pro Display, -apple-system, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            {words.slice(0, visibleWords).map((word, index) => {
              const wordDelay = t.textDelay + index * t.wordDelay;
              const wordProgress = interpolate(
                frame,
                [wordDelay, wordDelay + t.wordDelay],
                [0, 1],
                { extrapolateRight: 'clamp' }
              );

              const wordOpacity = interpolate(
                wordProgress,
                [0, 1],
                [0, 1],
                { extrapolateRight: 'clamp' }
              );

              // Highlight certain words with cyan
              const isHighlight = index % 5 === 2;

              return (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    marginRight: 12,
                    marginBottom: 8,
                    opacity: wordOpacity,
                    color: isHighlight ? c.secondary : c.primary,
                    textShadow: isHighlight ? `0 0 15px ${c.secondary}80` : 'none'
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Data stream effect (bottom) */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          fontSize: 11,
          fontFamily: 'monospace',
          color: c.secondary,
          opacity: 0.6,
          letterSpacing: '1px'
        }}
      >
        <span>{'>'} NEURAL LINK</span>
        <span>SYS_OK</span>
        <span>FEED_{Math.floor(frame / 10) % 100}</span>
      </div>

      {/* Corner brackets (UI frame) */}
      <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.4 }}>
        {/* Top left */}
        <path d="M 40 40 L 40 80 M 40 40 L 80 40" stroke={c.secondary} strokeWidth="2" fill="none"/>
        {/* Top right */}
        <path d="M 1040 40 L 1040 80 M 1040 40 L 1000 40" stroke={c.secondary} strokeWidth="2" fill="none"/>
        {/* Bottom left */}
        <path d="M 40 1040 L 40 1000 M 40 1040 L 80 1040" stroke={c.secondary} strokeWidth="2" fill="none"/>
        {/* Bottom right */}
        <path d="M 1040 1040 L 1040 1000 M 1040 1040 L 1000 1040" stroke={c.secondary} strokeWidth="2" fill="none"/>
      </svg>

      {/* Timestamp effect */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          right: 80,
          fontSize: 14,
          fontFamily: 'monospace',
          color: c.secondary,
          opacity: 0.7,
          letterSpacing: '1px'
        }}
      >
        {new Date().toISOString().slice(0, 19).replace('T', ' ')}
      </div>
    </AbsoluteFill>
  );
};
