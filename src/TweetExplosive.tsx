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

export const TweetExplosive: React.FC<Props> = ({ tweetData, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Default high-energy colors
  const c = colors || {
    primary: '#FFFFFF',
    secondary: '#FCD34D',
    background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #DC2626 100%)',
    accent: '#FBBF24'
  };

  const t = timing || {
    textDelay: 25,
    imageDelay: 90,
    wordDelay: 2.5
  };

  // Split text into words
  const words = tweetData.text.split(' ');

  // Author explosion animation
  const authorSpring = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 50,
      stiffness: 200,
      mass: 0.5
    }
  });

  const authorScale = interpolate(
    authorSpring,
    [0, 1],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const authorRotate = interpolate(
    authorSpring,
    [0, 1],
    [360, 0]
  );

  // Particle effects (energy rays)
  const particleCount = 12;
  const particles = Array.from({ length: particleCount }, (_, i) => i);

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* AI Generated Images with Explosive Burst Effect */}
      {aiImages && aiImages.map((img, idx) => {
        const burstStart = img.startFrame;
        const burstPeak = img.startFrame + 15;
        const burstEnd = img.startFrame + 75;

        if (frame < burstStart || frame > burstEnd) return null;

        // Explosive scale animation
        const scale = spring({
          frame: frame - burstStart,
          fps,
          config: {
            damping: 15,
            stiffness: 100,
            mass: 0.3
          }
        });

        const imageScale = interpolate(
          scale,
          [0, 1],
          [0.3, 1],
          { extrapolateRight: 'clamp' }
        );

        // Fade in quickly, hold, fade out
        const opacity = interpolate(
          frame,
          [burstStart, burstPeak, burstEnd - 10, burstEnd],
          [0, 0.8, 0.8, 0],
          { extrapolateRight: 'clamp' }
        );

        // Rotation burst
        const rotation = interpolate(
          frame,
          [burstStart, burstPeak],
          [180, 0],
          { extrapolateRight: 'clamp' }
        );

        const positions = [
          { top: '20%', left: '15%' },
          { top: '20%', right: '15%' },
          { bottom: '25%', left: '50%', transform: 'translateX(-50%)' }
        ];

        const pos = positions[idx % positions.length];

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              ...pos,
              width: 200,
              height: 140,
              opacity,
            }}
          >
            <Img
              src={img.url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 12,
                transform: `scale(${imageScale}) rotate(${rotation}deg)`,
                border: `3px solid ${c.secondary}`,
                boxShadow: `
                  0 0 40px ${c.accent},
                  0 10px 30px rgba(0,0,0,0.5)
                `,
                filter: 'brightness(1.2) contrast(1.1)',
              }}
            />
          </div>
        );
      })}

      {/* Energy rays from center */}
      {particles.map((i) => {
        const angle = (360 / particleCount) * i;
        const rayLength = interpolate(
          frame,
          [0, 40],
          [0, 600],
          { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
        );
        const rayOpacity = interpolate(
          frame,
          [0, 20, 40],
          [0, 0.3, 0],
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
              height: rayLength,
              background: `linear-gradient(to bottom, ${c.accent}88, transparent)`,
              transformOrigin: 'top center',
              transform: `rotate(${angle}deg)`,
              opacity: rayOpacity
            }}
          />
        );
      })}

      {/* Content container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 80,
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Author with explosive entrance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 50,
            transform: `scale(${authorScale}) rotate(${authorRotate}deg)`,
            opacity: authorScale
          }}
        >
          {tweetData.author.profilePicUrl && (
            <div
              style={{
                position: 'relative'
              }}
            >
              {/* Impact ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: -15,
                  border: `4px solid ${c.accent}`,
                  borderRadius: '50%',
                  opacity: interpolate(
                    frame,
                    [5, 25],
                    [1, 0],
                    { extrapolateRight: 'clamp' }
                  ),
                  transform: `scale(${interpolate(
                    frame,
                    [5, 25],
                    [1, 2],
                    { extrapolateRight: 'clamp' }
                  )})`
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: -8,
                  background: c.accent,
                  borderRadius: '50%',
                  filter: 'blur(20px)',
                  opacity: 0.5
                }}
              />
              <Img
                src={tweetData.author.profilePicUrl}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  position: 'relative',
                  border: `4px solid ${c.accent}`,
                  boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
                }}
              />
            </div>
          )}
          <div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: c.primary,
                fontFamily: 'sans-serif',
                textTransform: 'uppercase',
                textShadow: `
                  3px 3px 0px rgba(0, 0, 0, 0.3),
                  0 0 20px ${c.accent}
                `,
                letterSpacing: 1
              }}
            >
              {tweetData.author.name}
            </div>
            <div
              style={{
                fontSize: 22,
                color: c.secondary,
                fontFamily: 'sans-serif',
                fontWeight: 700,
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              {tweetData.author.username}
            </div>
          </div>
        </div>

        {/* Explosive word-by-word reveal */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 14,
            maxWidth: 800,
            marginBottom: tweetData.media && tweetData.media.length > 0 ? 50 : 0
          }}
        >
          {words.map((word, index) => {
            const wordStartFrame = t.textDelay + (index * t.wordDelay);

            // Explosive spring animation
            const wordSpring = spring({
              frame: frame - wordStartFrame,
              fps,
              config: {
                damping: 30,
                stiffness: 300,
                mass: 0.5,
                overshootClamping: false
              }
            });

            const wordScale = interpolate(
              wordSpring,
              [0, 1],
              [0, 1]
            );

            // Rotation explosion
            const wordRotate = interpolate(
              wordSpring,
              [0, 1],
              [Math.random() * 720 - 360, 0]
            );

            // Particles around each word
            const particleScale = interpolate(
              frame,
              [wordStartFrame, wordStartFrame + 15],
              [0, 2],
              { extrapolateRight: 'clamp' }
            );

            const particleOpacity = interpolate(
              frame,
              [wordStartFrame, wordStartFrame + 15],
              [1, 0],
              { extrapolateRight: 'clamp' }
            );

            return (
              <div
                key={index}
                style={{
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                {/* Particle burst effect */}
                {[0, 1, 2, 3, 4, 5].map((particleIndex) => {
                  const particleAngle = (360 / 6) * particleIndex;
                  const particleDistance = 30 * particleScale;

                  return (
                    <div
                      key={particleIndex}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: c.accent,
                        transform: `
                          translate(-50%, -50%)
                          rotate(${particleAngle}deg)
                          translateX(${particleDistance}px)
                        `,
                        opacity: particleOpacity,
                        boxShadow: `0 0 10px ${c.accent}`
                      }}
                    />
                  );
                })}

                {/* Impact shockwave */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: 100,
                    height: 100,
                    border: `3px solid ${c.accent}`,
                    borderRadius: '50%',
                    transform: `translate(-50%, -50%) scale(${particleScale})`,
                    opacity: particleOpacity * 0.5
                  }}
                />

                {/* The word */}
                <span
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                    color: c.primary,
                    fontFamily: 'sans-serif',
                    display: 'inline-block',
                    transform: `scale(${wordScale}) rotate(${wordRotate}deg)`,
                    opacity: wordScale,
                    textShadow: `
                      3px 3px 0px rgba(0, 0, 0, 0.3),
                      0 0 20px ${c.accent},
                      0 0 40px ${c.accent}
                    `,
                    position: 'relative',
                    zIndex: 2,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  {word}
                </span>
              </div>
            );
          })}
        </div>

        {/* Media with explosive reveal */}
        {tweetData.media && tweetData.media.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: tweetData.media.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              gap: 24
            }}
          >
            {tweetData.media.map((item, index) => {
              const mediaStartFrame = t.imageDelay + (index * 10);

              const mediaSpring = spring({
                frame: frame - mediaStartFrame,
                fps,
                config: {
                  damping: 60,
                  stiffness: 200
                }
              });

              const mediaScale = interpolate(mediaSpring, [0, 1], [0, 1]);
              const mediaRotate = interpolate(mediaSpring, [0, 1], [45, 0]);

              // Impact ring
              const impactOpacity = interpolate(
                frame,
                [mediaStartFrame, mediaStartFrame + 20],
                [1, 0],
                { extrapolateRight: 'clamp' }
              );

              const impactScale = interpolate(
                frame,
                [mediaStartFrame, mediaStartFrame + 20],
                [1, 1.5],
                { extrapolateRight: 'clamp' }
              );

              return (
                <div
                  key={index}
                  style={{
                    position: 'relative'
                  }}
                >
                  {/* Impact effect */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: -20,
                      border: `4px solid ${c.accent}`,
                      borderRadius: 16,
                      opacity: impactOpacity,
                      transform: `scale(${impactScale})`
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: -10,
                      background: c.accent,
                      borderRadius: 16,
                      filter: 'blur(15px)',
                      opacity: 0.4
                    }}
                  />
                  <Img
                    src={item.url}
                    style={{
                      width: tweetData.media!.length === 1 ? 420 : 300,
                      height: tweetData.media!.length === 1 ? 320 : 240,
                      objectFit: 'cover',
                      position: 'relative',
                      borderRadius: 12,
                      border: `4px solid ${c.accent}`,
                      transform: `scale(${mediaScale}) rotate(${mediaRotate}deg)`,
                      boxShadow: `0 0 40px ${c.accent}`
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Energy border pulses */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `8px solid ${c.accent}`,
          opacity: interpolate(
            Math.sin(frame * 0.2),
            [-1, 1],
            [0.2, 0.6]
          ),
          boxShadow: `inset 0 0 50px ${c.accent}, 0 0 50px ${c.accent}`,
          pointerEvents: 'none'
        }}
      />

      {/* Corner impact marks */}
      {[
        { top: 20, left: 20, rotate: 0 },
        { top: 20, right: 20, rotate: 90 },
        { bottom: 20, left: 20, rotate: 270 },
        { bottom: 20, right: 20, rotate: 180 }
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...pos,
            width: 40,
            height: 40,
            opacity: interpolate(
              frame,
              [i * 5, i * 5 + 20],
              [0, 0.8],
              { extrapolateRight: 'clamp' }
            )
          }}
        >
          {[0, 1, 2].map((line) => (
            <div
              key={line}
              style={{
                position: 'absolute',
                width: 40 - line * 10,
                height: 4,
                background: c.accent,
                top: line * 10,
                transform: `rotate(${pos.rotate}deg)`,
                boxShadow: `0 0 10px ${c.accent}`
              }}
            />
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};
