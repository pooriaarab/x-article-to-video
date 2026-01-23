import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, Easing, spring, random } from "remotion";

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
}

export const TweetParticleBurst: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#FFD700',
    secondary: '#FF6B35',
    background: '#1A1A2E',
    accent: '#7B2CBF'
  };

  // Split text into words
  const words = (tweetData.text || '').split(' ').filter(w => w.length > 0);

  // Word-by-word reveal
  const wordsPerScreen = 2;
  const wordTransitionDuration = 40;
  const currentWordIndex = Math.floor(frame / wordTransitionDuration) % Math.ceil(words.length / wordsPerScreen);
  const currentWords = words.slice(currentWordIndex * wordsPerScreen, (currentWordIndex + 1) * wordsPerScreen);

  // Particle system
  const particleCount = 50;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const seed = i * 1000 + frame;
    const angle = random(seed) * Math.PI * 2;
    const velocity = random(seed + 1) * 5 + 2;
    const size = random(seed + 2) * 20 + 5;
    const hue = random(seed + 3) * 60;

    // Explosion from center
    const progress = ((frame % wordTransitionDuration) / wordTransitionDuration);
    const distance = interpolate(
      progress,
      [0, 0.4, 1],
      [0, 300, 400],
      { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
    );

    const x = Math.cos(angle) * distance * velocity;
    const y = Math.sin(angle) * distance * velocity - (progress * progress * 500); // Gravity

    const opacity = interpolate(
      progress,
      [0, 0.2, 0.8, 1],
      [0, 1, 1, 0],
      { extrapolateRight: 'clamp' }
    );

    const rotation = progress * 360 * velocity;

    return { x, y, size, hue, opacity, rotation };
  });

  // Word entrance animation
  const wordEntrance = spring({
    frame: frame % wordTransitionDuration,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
      mass: 0.5
    }
  });

  const wordScale = interpolate(wordEntrance, [0, 1], [0.3, 1]);
  const wordOpacity = interpolate(wordEntrance, [0, 1], [0, 1]);

  // Background images with parallax
  const allMedia = [
    ...(aiImages || []).map(img => img.url),
    ...(tweetData.media || []).map(m => m.url)
  ];

  const bgImageIndex = Math.floor(frame / 60) % (allMedia.length || 1);
  const parallaxOffset = Math.sin(frame / 30) * 50;

  // Energy rings
  const ringCount = 3;
  const rings = Array.from({ length: ringCount }, (_, i) => {
    const ringFrame = (frame - i * 10) % wordTransitionDuration;
    const ringProgress = ringFrame / wordTransitionDuration;

    const scale = interpolate(
      ringProgress,
      [0, 1],
      [0, 3],
      { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
    );

    const opacity = interpolate(
      ringProgress,
      [0, 0.3, 1],
      [0, 0.6, 0],
      { extrapolateRight: 'clamp' }
    );

    return { scale, opacity };
  });

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 50%, ${c.background}, #000000)`,
      overflow: 'hidden',
    }}>
      {/* Background image with parallax */}
      {allMedia[bgImageIndex] && (
        <div style={{
          position: 'absolute',
          inset: -100,
          transform: `translate(${parallaxOffset}px, ${parallaxOffset * 0.5}px) scale(1.2)`,
        }}>
          <Img
            src={allMedia[bgImageIndex]}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.3) blur(5px) saturate(1.5)',
            }}
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 50%, transparent 30%, ${c.background}ee 100%)`,
      }} />

      {/* Particle system */}
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: particle.size,
            height: particle.size,
            background: `hsl(${(hue => {
              if (c.primary === '#FFD700') return 45 + particle.hue;
              if (c.primary.includes('FF')) return 15 + particle.hue;
              return particle.hue;
            })()}, 100%, 60%)`,
            borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '0' : '2px',
            transform: `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size}px currentColor`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Energy rings */}
      {rings.map((ring, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 400,
            height: 400,
            border: `4px solid ${c.primary}`,
            borderRadius: '50%',
            transform: `translate(-50%, -50%) scale(${ring.scale})`,
            opacity: ring.opacity,
            boxShadow: `0 0 40px ${c.primary}, inset 0 0 40px ${c.primary}`,
          }}
        />
      ))}

      {/* Main text with explosion effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        transform: `scale(${wordScale})`,
        opacity: wordOpacity,
      }}>
        {currentWords.map((word, idx) => {
          const wordDelay = idx * 5;
          const wordFrame = Math.max(0, (frame % wordTransitionDuration) - wordDelay);

          const wordSpring = spring({
            frame: wordFrame,
            fps,
            config: {
              damping: 20,
              stiffness: 150,
              mass: 0.3
            }
          });

          const individualScale = interpolate(wordSpring, [0, 1], [0.5, 1]);

          return (
            <div
              key={idx}
              style={{
                fontSize: 90,
                fontWeight: 900,
                color: c.primary,
                fontFamily: 'Impact, sans-serif',
                textTransform: 'uppercase',
                textAlign: 'center',
                transform: `scale(${individualScale})`,
                textShadow: `
                  0 0 20px ${c.secondary},
                  0 0 40px ${c.secondary},
                  0 0 60px ${c.accent},
                  0 10px 30px rgba(0,0,0,0.8)
                `,
                WebkitTextStroke: `3px ${c.background}`,
                letterSpacing: 3,
                filter: 'drop-shadow(0 0 10px currentColor)',
              }}
            >
              {word}
            </div>
          );
        })}
      </div>

      {/* Light rays */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * 360;
        const length = interpolate(
          (frame % 60),
          [0, 30, 60],
          [0, 600, 0],
          { extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 4,
              height: length,
              background: `linear-gradient(to bottom, ${c.accent}, transparent)`,
              transform: `rotate(${angle}deg) translateY(-50%)`,
              transformOrigin: 'top center',
              opacity: 0.3,
              filter: 'blur(2px)',
            }}
          />
        );
      })}

      {/* Author badge with glow */}
      <div style={{
        position: 'absolute',
        bottom: 50,
        left: '50%',
        transform: `translateX(-50%) scale(${interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' })})`,
        opacity: interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${c.secondary}, ${c.accent})`,
          padding: 16,
          borderRadius: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: `
            0 0 30px ${c.secondary},
            0 10px 40px rgba(0,0,0,0.5)
          `,
          border: `2px solid ${c.primary}`,
        }}>
          {tweetData.author.profilePicUrl && (
            <Img
              src={tweetData.author.profilePicUrl}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                border: `3px solid ${c.primary}`,
                boxShadow: `0 0 15px ${c.primary}`,
              }}
            />
          )}
          <div>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'Arial, sans-serif',
            }}>
              {tweetData.author.name}
            </div>
            <div style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'Arial, sans-serif',
            }}>
              {tweetData.author.username}
            </div>
          </div>
        </div>
      </div>

      {/* Progress counter */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 40,
        fontSize: 28,
        fontWeight: 700,
        color: c.primary,
        fontFamily: 'monospace',
        textShadow: `0 0 20px ${c.primary}`,
        background: 'rgba(0,0,0,0.6)',
        padding: '12px 20px',
        borderRadius: 10,
        border: `2px solid ${c.primary}`,
      }}>
        {currentWordIndex + 1}/{Math.ceil(words.length / wordsPerScreen)}
      </div>
    </AbsoluteFill>
  );
};
