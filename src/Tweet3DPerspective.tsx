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
}

export const Tweet3DPerspective: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#00D9FF',
    secondary: '#FF00D9',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: '#FFD700'
  };

  // Split text into words
  const words = (tweetData.text || '').split(' ').filter(w => w.length > 0);

  // Continuous 3D rotation
  const rotateY = (frame * 2) % 360;
  const rotateX = Math.sin(frame / 30) * 15;

  // Wave effect for words
  const getWordTransform = (index: number, totalWords: number) => {
    const wordDelay = index * 3;
    const wordFrame = Math.max(0, frame - wordDelay);

    const z = interpolate(
      wordFrame,
      [0, 20],
      [500, 0],
      { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
    );

    const y = Math.sin((frame + index * 10) / 15) * 30;
    const opacity = interpolate(wordFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

    return { z, y, opacity };
  };

  // Background images floating in 3D space
  const allMedia = [
    ...(aiImages || []).map(img => img.url),
    ...(tweetData.media || []).map(m => m.url)
  ];

  return (
    <AbsoluteFill style={{
      background: typeof c.background === 'string' && c.background.includes('gradient')
        ? c.background
        : c.background,
      overflow: 'hidden',
      perspective: '1000px',
      perspectiveOrigin: '50% 50%'
    }}>
      {/* Animated gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at ${50 + Math.sin(frame / 50) * 20}% ${50 + Math.cos(frame / 50) * 20}%, ${c.primary}33, transparent 70%)`,
      }} />

      {/* Floating 3D images */}
      {allMedia.map((url, idx) => {
        const floatY = Math.sin((frame + idx * 30) / 20) * 100;
        const floatX = Math.cos((frame + idx * 40) / 25) * 150;
        const imageRotate = (frame + idx * 45) * 0.5;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${20 + idx * 30}%`,
              top: '50%',
              transform: `
                translate(${floatX}px, ${floatY}px)
                rotateY(${imageRotate}deg)
                rotateX(${rotateX}deg)
              `,
              transformStyle: 'preserve-3d',
              opacity: 0.3,
            }}
          >
            <Img
              src={url}
              style={{
                width: 200,
                height: 150,
                objectFit: 'cover',
                borderRadius: 12,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                filter: 'brightness(0.7) saturate(1.5)',
              }}
            />
          </div>
        );
      })}

      {/* 3D Text Container */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transformStyle: 'preserve-3d',
        transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
      }}>
        {/* Words in 3D space */}
        {words.map((word, index) => {
          const { z, y, opacity } = getWordTransform(index, words.length);

          return (
            <div
              key={index}
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: c.primary,
                fontFamily: 'Arial Black, sans-serif',
                textTransform: 'uppercase',
                margin: '8px 0',
                transform: `translateZ(${z}px) translateY(${y}px)`,
                opacity,
                textShadow: `
                  0 0 20px ${c.secondary},
                  0 0 40px ${c.secondary},
                  ${z / 10}px ${z / 10}px ${z / 5}px rgba(0,0,0,0.5)
                `,
                WebkitTextStroke: `2px ${c.secondary}`,
                letterSpacing: 4,
              }}
            >
              {word}
            </div>
          );
        })}
      </div>

      {/* Author card with 3D effect */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: '50%',
        transform: `
          translateX(-50%)
          translateZ(${interpolate(frame, [0, 30], [200, 0], { extrapolateRight: 'clamp' })}px)
          rotateX(${interpolate(frame, [0, 30], [45, 0], { extrapolateRight: 'clamp' })}deg)
        `,
        transformStyle: 'preserve-3d',
        opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          padding: 20,
          borderRadius: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          border: `2px solid ${c.accent}`,
          boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 20px ${c.accent}50`,
        }}>
          {tweetData.author.profilePicUrl && (
            <Img
              src={tweetData.author.profilePicUrl}
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: `3px solid ${c.primary}`,
                boxShadow: `0 0 15px ${c.primary}`,
              }}
            />
          )}
          <div>
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: c.primary,
              fontFamily: 'Arial, sans-serif',
            }}>
              {tweetData.author.name}
            </div>
            <div style={{
              fontSize: 14,
              color: c.secondary,
              fontFamily: 'Arial, sans-serif',
            }}>
              {tweetData.author.username}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Grid overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          repeating-linear-gradient(
            0deg,
            ${c.primary}11 0px,
            transparent 2px,
            transparent 50px
          ),
          repeating-linear-gradient(
            90deg,
            ${c.primary}11 0px,
            transparent 2px,
            transparent 50px
          )
        `,
        transform: 'perspective(500px) rotateX(60deg) translateY(50%)',
        opacity: 0.3,
      }} />
    </AbsoluteFill>
  );
};
