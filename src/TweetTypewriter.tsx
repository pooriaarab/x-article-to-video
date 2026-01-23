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

export const TweetTypewriter: React.FC<Props> = ({ tweetData, durationInFrames, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Default typewriter colors
  const c = colors || {
    primary: '#1A1A1A',
    secondary: '#666666',
    background: '#F5F1E8',
    accent: '#2C5F8D'
  };

  const t = timing || {
    textDelay: 20,
    imageDelay: 100,
    wordDelay: 4
  };

  // Split text into words
  const words = tweetData.text.split(' ');

  // Author typewriter effect
  const authorProgress = interpolate(
    frame,
    [0, 20],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
  );

  // Cursor blink
  const cursorOpacity = Math.sin(frame * 0.5) > 0 ? 1 : 0;

  // Paper texture animation (subtle)
  const paperY = interpolate(
    frame,
    [0, 30],
    [-20, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill
      style={{
        background: c.background,
        position: 'relative'
      }}
    >
      {/* Paper texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 30px,
              rgba(0, 0, 0, 0.03) 30px,
              rgba(0, 0, 0, 0.03) 31px
            )
          `,
          opacity: 0.5
        }}
      />

      {/* Subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
          pointerEvents: 'none'
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
          padding: 100,
          position: 'relative',
          zIndex: 1,
          transform: `translateY(${paperY}px)`
        }}
      >
        {/* Paper card */}
        <div
          style={{
            maxWidth: 750,
            width: '100%',
            background: '#FFFFFF',
            borderRadius: 4,
            padding: 60,
            boxShadow: `
              0 1px 3px rgba(0, 0, 0, 0.12),
              0 1px 2px rgba(0, 0, 0, 0.08),
              inset 0 0 60px rgba(0, 0, 0, 0.02)
            `,
            position: 'relative',
            border: '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Top decorative line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 40,
              right: 40,
              height: 3,
              background: c.accent,
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
              opacity: authorProgress
            }}
          >
            {tweetData.author.profilePicUrl && (
              <Img
                src={tweetData.author.profilePicUrl}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `3px solid ${c.accent}`,
                  filter: 'grayscale(0.2)'
                }}
              />
            )}
            <div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: c.primary,
                  fontFamily: 'Georgia, serif',
                  marginBottom: 4
                }}
              >
                {tweetData.author.name}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: c.secondary,
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic'
                }}
              >
                {tweetData.author.username}
              </div>
            </div>
          </div>

          {/* Typewriter text - word by word */}
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.8,
              color: c.primary,
              fontFamily: '"Courier New", Courier, monospace',
              marginBottom: tweetData.media && tweetData.media.length > 0 ? 40 : 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}
          >
            {words.map((word, index) => {
              const wordStartFrame = t.textDelay + (index * t.wordDelay);
              const wordEndFrame = wordStartFrame + t.wordDelay;

              // Word appears instantly when it's time (typewriter effect)
              const wordVisible = frame >= wordStartFrame;

              // Show cursor on the current word being typed
              const showCursor = frame >= wordStartFrame && frame < wordEndFrame;

              // Slight bounce when word appears
              const wordY = interpolate(
                frame,
                [wordStartFrame, wordStartFrame + 3],
                [-2, 0],
                { extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) }
              );

              return (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    opacity: wordVisible ? 1 : 0,
                    transform: `translateY(${wordVisible ? wordY : 0}px)`,
                    position: 'relative'
                  }}
                >
                  {word}
                  {showCursor && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: 3,
                        height: 28,
                        background: c.primary,
                        marginLeft: 4,
                        opacity: cursorOpacity,
                        verticalAlign: 'middle',
                        animation: 'blink 0.5s step-end infinite'
                      }}
                    />
                  )}
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
                transform: `translateY(${interpolate(
                  frame,
                  [t.imageDelay, t.imageDelay + 20],
                  [20, 0],
                  { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
                )}px)`
              }}
            >
              {tweetData.media.map((item, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Img
                    src={item.url}
                    style={{
                      width: '100%',
                      height: tweetData.media!.length === 1 ? 320 : 240,
                      objectFit: 'cover',
                      filter: 'grayscale(0.1)'
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Quote marks decoration */}
          <div
            style={{
              position: 'absolute',
              top: 25,
              left: 25,
              fontSize: 60,
              color: c.accent,
              opacity: 0.15,
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              lineHeight: 1
            }}
          >
            "
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 25,
              right: 35,
              fontSize: 60,
              color: c.accent,
              opacity: 0.15,
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              lineHeight: 1,
              transform: 'rotate(180deg)'
            }}
          >
            "
          </div>
        </div>

        {/* Timestamp decoration */}
        <div
          style={{
            marginTop: 30,
            fontSize: 16,
            color: c.secondary,
            fontFamily: '"Courier New", Courier, monospace',
            opacity: interpolate(
              frame,
              [30, 50],
              [0, 0.6],
              { extrapolateRight: 'clamp' }
            ),
            textAlign: 'center'
          }}
        >
          [ TYPEWRITER TRANSCRIPT ]
        </div>
      </div>

      {/* Corner paper clips */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 80,
          width: 50,
          height: 8,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.2), rgba(0,0,0,0.1))',
          borderRadius: 4,
          transform: 'rotate(-45deg)',
          opacity: interpolate(frame, [0, 20], [0, 0.5], { extrapolateRight: 'clamp' }),
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 80,
          width: 50,
          height: 8,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.2), rgba(0,0,0,0.1))',
          borderRadius: 4,
          transform: 'rotate(45deg)',
          opacity: interpolate(frame, [0, 20], [0, 0.5], { extrapolateRight: 'clamp' }),
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      />

      {/* Ink smudge decorations */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: 100,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.08)',
          filter: 'blur(2px)',
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' })
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          right: 150,
          width: 15,
          height: 15,
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.06)',
          filter: 'blur(2px)',
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' })
        }}
      />
    </AbsoluteFill>
  );
};
