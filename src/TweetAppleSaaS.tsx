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

export const TweetAppleSaaS: React.FC<Props> = ({ tweetData, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Apple/Modern SaaS colors (clean blue/white)
  const c = colors || {
    primary: '#000000',
    secondary: '#007AFF',
    background: '#FFFFFF',
    accent: '#5856D6'
  };

  const t = timing || {
    textDelay: 22,
    imageDelay: 75,
    wordDelay: 2.8
  };

  // Split text into words
  const words = tweetData.text.split(' ');
  const totalWords = words.length;

  // Spring physics for avatar
  const avatarSpring = spring({
    frame: frame - 8,
    fps,
    config: {
      damping: 15,
      stiffness: 80,
      mass: 0.8
    }
  });

  const avatarScale = interpolate(
    avatarSpring,
    [0, 1],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Smooth word reveal
  const visibleWords = Math.min(
    totalWords,
    Math.floor(interpolate(
      frame,
      [t.textDelay, t.textDelay + totalWords * t.wordDelay],
      [0, totalWords],
      { extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) }
    ))
  );

  // Floating card animation
  const cardFloat = interpolate(
    Math.sin(frame / 30),
    [-1, 1],
    [-5, 5]
  );

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* AI Generated Background Images with Parallax */}
      {aiImages && aiImages.map((img, idx) => {
        const fadeInStart = img.startFrame;
        const fadeInEnd = img.startFrame + 30;
        const fadeOutStart = img.startFrame + 60;
        const fadeOutEnd = img.startFrame + 90;

        const opacity = interpolate(
          frame,
          [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
          [0, 0.15, 0.15, 0],
          { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
        );

        const parallaxY = interpolate(
          frame - img.startFrame,
          [0, 90],
          [0, -50],
          { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
        );

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              opacity,
              transform: `translateY(${parallaxY}px)`,
            }}
          >
            <Img
              src={img.url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(30px)',
              }}
            />
          </div>
        );
      })}

      {/* Subtle gradient background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 30% 20%, rgba(0, 122, 255, 0.05), transparent 50%)',
          opacity: 0.6
        }}
      />

      {/* Floating geometric shapes in background */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          right: 100,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${c.secondary}10, ${c.accent}10)`,
          filter: 'blur(40px)',
          transform: `translateY(${cardFloat}px)`,
          opacity: 0.4
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 200,
          left: 120,
          width: 200,
          height: 200,
          borderRadius: '20%',
          background: `linear-gradient(225deg, ${c.accent}08, ${c.secondary}08)`,
          filter: 'blur(50px)',
          transform: `translateY(${-cardFloat}px) rotate(45deg)`,
          opacity: 0.3
        }}
      />

      {/* Author card with floating shadow */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 90,
          transform: `scale(${avatarScale}) translateY(${cardFloat * 0.5}px)`,
          zIndex: 3
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 24,
            padding: 24,
            boxShadow: `
              0 2px 8px rgba(0, 0, 0, 0.04),
              0 8px 24px rgba(0, 0, 0, 0.08),
              0 16px 48px rgba(0, 0, 0, 0.12)
            `,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12
          }}
        >
          {tweetData.author.profilePicUrl && (
            <Img
              src={tweetData.author.profilePicUrl}
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${c.secondary}15`
              }}
            />
          )}

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: c.primary,
                fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                marginBottom: 4
              }}
            >
              {tweetData.author.name}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: c.secondary,
                fontFamily: 'SF Pro Display, -apple-system, sans-serif'
              }}
            >
              {tweetData.author.username}
            </div>
          </div>
        </div>
      </div>

      {/* Main text card with kinetic typography */}
      <div
        style={{
          position: 'absolute',
          top: 350,
          left: 80,
          right: 80,
          transform: `translateY(${cardFloat * 0.3}px)`,
          zIndex: 2
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '36px 40px',
            boxShadow: `
              0 2px 8px rgba(0, 0, 0, 0.04),
              0 8px 24px rgba(0, 0, 0, 0.08),
              0 16px 48px rgba(0, 0, 0, 0.12)
            `
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 600,
              lineHeight: 1.3,
              color: c.primary,
              fontFamily: 'Inter, SF Pro Display, -apple-system, sans-serif',
              letterSpacing: '-0.5px'
            }}
          >
            {words.slice(0, visibleWords).map((word, index) => {
              const wordDelay = t.textDelay + index * t.wordDelay;

              // Spring animation for each word
              const wordSpring = spring({
                frame: frame - wordDelay,
                fps,
                config: {
                  damping: 18,
                  stiffness: 100,
                  mass: 0.5
                }
              });

              const wordScale = interpolate(
                wordSpring,
                [0, 1],
                [0.8, 1],
                { extrapolateRight: 'clamp' }
              );

              const wordOpacity = interpolate(
                wordSpring,
                [0, 1],
                [0, 1],
                { extrapolateRight: 'clamp' }
              );

              // Alternate color every few words
              const isBlue = index % 7 === 3 || index % 7 === 5;

              return (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    marginRight: 14,
                    marginBottom: 8,
                    transform: `scale(${wordScale})`,
                    opacity: wordOpacity,
                    color: isBlue ? c.secondary : c.primary,
                    transformOrigin: 'center'
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decorative floating badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          right: 100,
          background: c.secondary,
          borderRadius: 16,
          padding: '12px 24px',
          fontSize: 16,
          fontWeight: 600,
          color: '#FFFFFF',
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          boxShadow: `
            0 2px 8px ${c.secondary}20,
            0 8px 24px ${c.secondary}30,
            0 16px 48px ${c.secondary}40
          `,
          opacity: interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' }),
          transform: `translateY(${cardFloat * 0.8}px)`
        }}
      >
        ✓ Verified
      </div>

      {/* Progress indicator dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateRight: 'clamp' })
        }}
      >
        {[0, 1, 2].map((i) => {
          const dotProgress = interpolate(
            frame,
            [40 + i * 5, 55 + i * 5],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={i}
              style={{
                width: i === 1 ? 32 : 8,
                height: 8,
                borderRadius: 4,
                background: i === 1 ? c.secondary : '#E5E5EA',
                transition: 'all 0.3s',
                opacity: dotProgress
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
