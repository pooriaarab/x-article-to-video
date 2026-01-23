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

export const TweetMrBeast: React.FC<Props> = ({ tweetData, durationInFrames, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // MrBeast style colors (bold, high contrast)
  const c = colors || {
    primary: '#FFFFFF',
    secondary: '#FFD700',
    background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)',
    accent: '#FF0000'
  };

  const t = timing || {
    textDelay: 20,
    imageDelay: 70,
    wordDelay: 3
  };

  // Split text into words
  const words = tweetData.text.split(' ');
  const totalWords = words.length;

  // Word reveal animation
  const visibleWords = Math.min(
    totalWords,
    Math.floor(interpolate(
      frame,
      [t.textDelay, t.textDelay + totalWords * t.wordDelay],
      [0, totalWords],
      { extrapolateRight: 'clamp' }
    ))
  );

  // Avatar punch-in effect
  const avatarPunch = interpolate(
    frame,
    [5, 25],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2)) }
  );

  // Red circle animation (signature MrBeast style)
  const circleScale = interpolate(
    frame,
    [10, 30],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  );

  const circleRotate = interpolate(
    frame,
    [10, 100],
    [0, 360],
    { extrapolateRight: 'extend' }
  );

  // Arrow animations (pointing at text)
  const arrowSlide = interpolate(
    frame,
    [35, 55],
    [-200, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  );

  // Shock lines animation
  const shockLines = Array.from({ length: 8 }, (_, i) => i);

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* Diagonal stripe pattern (MrBeast thumbnail style) */}
      <div
        style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 40px,
            rgba(255, 255, 255, 0.03) 40px,
            rgba(255, 255, 255, 0.03) 80px
          )`,
          animation: 'diagonal-scroll 20s linear infinite'
        }}
      />

      {/* Author with red circle highlight */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 120,
          transform: `scale(${avatarPunch})`,
          zIndex: 3
        }}
      >
        {/* Red circle (signature MrBeast style) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${circleScale}) rotate(${circleRotate}deg)`,
            width: 180,
            height: 180,
            border: `8px solid ${c.accent}`,
            borderRadius: '50%',
            zIndex: 1
          }}
        />

        {tweetData.author.profilePicUrl && (
          <Img
            src={tweetData.author.profilePicUrl}
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              border: '6px solid #FFFFFF',
              objectFit: 'cover',
              position: 'relative',
              zIndex: 2,
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}
          />
        )}

        {/* Shock lines around avatar */}
        {shockLines.map((i) => {
          const angle = (360 / shockLines.length) * i;
          const lineOpacity = interpolate(
            frame,
            [15 + i * 2, 30 + i * 2],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 60,
                height: 8,
                background: c.secondary,
                transformOrigin: 'left center',
                transform: `translate(-30px, -4px) rotate(${angle}deg) translateX(100px)`,
                opacity: lineOpacity,
                borderRadius: 4
              }}
            />
          );
        })}
      </div>

      {/* Giant bold text (MrBeast style all caps) */}
      <div
        style={{
          position: 'absolute',
          top: 280,
          left: 60,
          right: 60,
          zIndex: 2
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1.2,
            textAlign: 'center',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            fontFamily: 'Impact, Arial Black, sans-serif',
            letterSpacing: '2px',
            textShadow: `
              6px 6px 0px ${c.accent},
              -2px -2px 0px #000000,
              0 0 20px rgba(0,0,0,0.8)
            `,
            WebkitTextStroke: '2px #000000'
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

            const wordScale = interpolate(
              wordProgress,
              [0, 0.5, 1],
              [1.5, 1.1, 1],
              { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) }
            );

            // Randomly highlight some words in yellow
            const isHighlight = index % 3 === 1;

            return (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  marginRight: 16,
                  marginBottom: 12,
                  transform: `scale(${wordScale})`,
                  color: isHighlight ? c.secondary : c.primary
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Giant arrows pointing at text */}
      <div
        style={{
          position: 'absolute',
          top: 250,
          right: 20,
          transform: `translateX(${-arrowSlide}px) rotate(-15deg)`,
          zIndex: 4
        }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path
            d="M10 50 L70 50 L70 30 L90 50 L70 70 L70 50"
            fill={c.accent}
            stroke="#FFFFFF"
            strokeWidth="4"
            filter="url(#glow)"
          />
        </svg>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 200,
          left: 20,
          transform: `translateX(${arrowSlide}px) rotate(15deg) scaleX(-1)`,
          zIndex: 4
        }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100">
          <path
            d="M10 50 L70 50 L70 30 L90 50 L70 70 L70 50"
            fill={c.secondary}
            stroke="#000000"
            strokeWidth="4"
            filter="url(#glow)"
          />
        </svg>
      </div>

      {/* Username badge at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          background: c.accent,
          padding: '16px 40px',
          borderRadius: 50,
          fontSize: 32,
          fontWeight: 900,
          color: '#FFFFFF',
          fontFamily: 'Impact, sans-serif',
          textTransform: 'uppercase',
          border: '5px solid #FFFFFF',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateRight: 'clamp' })
        }}
      >
        {tweetData.author.username}
      </div>

      {/* "YOU WON'T BELIEVE THIS" style banner */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          right: -20,
          background: c.accent,
          padding: '12px 40px',
          transform: 'rotate(5deg)',
          fontSize: 20,
          fontWeight: 900,
          color: '#FFFFFF',
          fontFamily: 'Impact, sans-serif',
          textTransform: 'uppercase',
          border: '4px solid #FFFFFF',
          boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
          opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: 'clamp' }),
          zIndex: 10
        }}
      >
        🔥 VIRAL 🔥
      </div>
    </AbsoluteFill>
  );
};
