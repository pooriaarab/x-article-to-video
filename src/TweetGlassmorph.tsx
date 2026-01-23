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

export const TweetGlassmorph: React.FC<Props> = ({ tweetData, durationInFrames, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Default values with neon accent colors
  const c = colors || {
    primary: '#FFFFFF',
    secondary: '#E0E7FF',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: '#00F0FF'
  };

  const t = timing || {
    textDelay: 15,
    imageDelay: 70,
    wordDelay: 2
  };

  // Split text into words for word-by-word animation
  const words = tweetData.text.split(' ');

  // Frosted glass card animation
  const cardSpring = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 80
    }
  });

  const cardScale = interpolate(cardSpring, [0, 1], [0.9, 1]);
  const cardBlur = interpolate(frame, [0, 30], [20, 0], { extrapolateRight: 'clamp' });

  // Author animation
  const authorOpacity = interpolate(
    frame,
    [5, 25],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  // Floating background orbs
  const orb1Y = interpolate(frame, [0, 180], [0, 50], { extrapolateRight: 'clamp' });
  const orb2Y = interpolate(frame, [0, 180], [0, -40], { extrapolateRight: 'clamp' });
  const orb3Rotate = interpolate(frame, [0, 180], [0, 360]);

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* Animated background orbs */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(0, 240, 255, 0.15)',
          top: -100 + orb1Y,
          right: -100,
          filter: 'blur(80px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(236, 72, 153, 0.15)',
          bottom: -100 + orb2Y,
          left: -100,
          filter: 'blur(80px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.2)',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotate(${orb3Rotate}deg) translate(200px, 0)`,
          filter: 'blur(60px)'
        }}
      />

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
        {/* Glassmorphism card */}
        <div
          style={{
            maxWidth: 800,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: `blur(${Math.max(cardBlur, 20)}px)`,
            WebkitBackdropFilter: `blur(${Math.max(cardBlur, 20)}px)`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 30,
            padding: 60,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            transform: `scale(${cardScale})`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Neon top border */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${c.accent}, #EC4899, #8B5CF6)`,
              boxShadow: `0 0 20px ${c.accent}`,
              transform: `scaleX(${interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })})`
            }}
          />

          {/* Author section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginBottom: 40,
              opacity: authorOpacity
            }}
          >
            {tweetData.author.profilePicUrl && (
              <div
                style={{
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: -4,
                    background: `linear-gradient(135deg, ${c.accent}, #EC4899)`,
                    borderRadius: '50%',
                    filter: 'blur(10px)',
                    opacity: 0.6
                  }}
                />
                <Img
                  src={tweetData.author.profilePicUrl}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    position: 'relative',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />
              </div>
            )}
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: c.primary,
                  fontFamily: 'sans-serif',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}
              >
                {tweetData.author.name}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: c.secondary,
                  fontFamily: 'sans-serif',
                  fontWeight: 500
                }}
              >
                {tweetData.author.username}
              </div>
            </div>
          </div>

          {/* Word-by-word animated text */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: tweetData.media && tweetData.media.length > 0 ? 40 : 0
            }}
          >
            {words.map((word, index) => {
              const wordStartFrame = t.textDelay + (index * t.wordDelay);

              // Determine direction for slide-in (alternate between directions)
              const directions = ['left', 'right', 'top', 'bottom'];
              const direction = directions[index % directions.length];

              let translateX = 0;
              let translateY = 0;

              const wordProgress = interpolate(
                frame,
                [wordStartFrame, wordStartFrame + 15],
                [0, 1],
                { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
              );

              switch (direction) {
                case 'left':
                  translateX = interpolate(wordProgress, [0, 1], [-50, 0]);
                  break;
                case 'right':
                  translateX = interpolate(wordProgress, [0, 1], [50, 0]);
                  break;
                case 'top':
                  translateY = interpolate(wordProgress, [0, 1], [-50, 0]);
                  break;
                case 'bottom':
                  translateY = interpolate(wordProgress, [0, 1], [50, 0]);
                  break;
              }

              const wordOpacity = interpolate(
                frame,
                [wordStartFrame, wordStartFrame + 15],
                [0, 1],
                { extrapolateRight: 'clamp' }
              );

              return (
                <span
                  key={index}
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: c.primary,
                    fontFamily: 'sans-serif',
                    display: 'inline-block',
                    transform: `translateX(${translateX}px) translateY(${translateY}px)`,
                    opacity: wordOpacity,
                    filter: `blur(${interpolate(wordOpacity, [0, 1], [10, 0])}px)`,
                    textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* Media */}
          {tweetData.media && tweetData.media.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: tweetData.media.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                gap: 20,
                opacity: interpolate(
                  frame,
                  [t.imageDelay, t.imageDelay + 20],
                  [0, 1],
                  { extrapolateRight: 'clamp' }
                ),
                transform: `scale(${interpolate(
                  frame,
                  [t.imageDelay, t.imageDelay + 20],
                  [0.9, 1],
                  { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
                )})`
              }}
            >
              {tweetData.media.map((item, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 16,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Img
                    src={item.url}
                    style={{
                      width: '100%',
                      height: tweetData.media!.length === 1 ? 300 : 200,
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Corner accent decorations */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          width: 60,
          height: 60,
          border: `2px solid ${c.accent}`,
          borderRight: 'none',
          borderBottom: 'none',
          opacity: interpolate(frame, [0, 20], [0, 0.6], { extrapolateRight: 'clamp' }),
          boxShadow: `0 0 20px ${c.accent}`
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          width: 60,
          height: 60,
          border: `2px solid #EC4899`,
          borderLeft: 'none',
          borderTop: 'none',
          opacity: interpolate(frame, [0, 20], [0, 0.6], { extrapolateRight: 'clamp' }),
          boxShadow: '0 0 20px #EC4899'
        }}
      />
    </AbsoluteFill>
  );
};
