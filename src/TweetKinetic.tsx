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

export const TweetKinetic: React.FC<Props> = ({ tweetData, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Default values
  const c = colors || {
    primary: '#1E293B',
    secondary: '#0084FF',
    background: '#F8FAFC',
    accent: '#FF006E'
  };

  const t = timing || {
    textDelay: 20,
    imageDelay: 60,
    wordDelay: 3
  };

  // Split text into words for kinetic typography
  const words = tweetData.text.split(' ');

  // Author animation
  const authorSpring = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 100
    }
  });

  const authorScale = interpolate(authorSpring, [0, 1], [0, 1]);
  const authorRotate = interpolate(authorSpring, [0, 1], [-15, 0]);

  // Background animation
  const bgRotate = interpolate(
    frame,
    [0, 300],
    [0, 360],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* AI Generated Images with Kinetic Motion */}
      {aiImages && aiImages.map((img, idx) => {
        const motionStart = img.startFrame;
        const motionEnd = img.startFrame + 85;

        if (frame < motionStart || frame > motionEnd) return null;

        // Dynamic spring animation
        const imageSpring = spring({
          frame: frame - motionStart,
          fps,
          config: {
            damping: 12,
            stiffness: 80,
            mass: 0.8
          }
        });

        // Slide in from different directions
        const directions = [
          { x: [-300, 0], y: [0, 0] }, // from left
          { x: [300, 0], y: [0, 0] },  // from right
          { x: [0, 0], y: [200, 0] }   // from bottom
        ];

        const dir = directions[idx % directions.length];

        const translateX = interpolate(imageSpring, [0, 1], dir.x);
        const translateY = interpolate(imageSpring, [0, 1], dir.y);

        // Rotation as it moves
        const rotation = interpolate(
          imageSpring,
          [0, 1],
          [idx % 2 === 0 ? -25 : 25, 0]
        );

        // Opacity
        const opacity = interpolate(
          frame,
          [motionStart, motionStart + 10, motionEnd - 10, motionEnd],
          [0, 1, 1, 0],
          { extrapolateRight: 'clamp' }
        );

        const positions = [
          { top: 150, left: 100 },
          { top: 400, right: 100 },
          { bottom: 150, left: '50%', transform: 'translateX(-50%)' }
        ];

        const pos = positions[idx % positions.length];

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              ...pos,
              width: 220,
              height: 160,
              opacity,
              zIndex: 1,
            }}
          >
            <Img
              src={img.url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 16,
                transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
                boxShadow: `
                  0 20px 60px rgba(0,0,0,0.3),
                  0 0 0 8px ${c.background},
                  0 0 0 10px ${c.secondary}40
                `,
                filter: 'saturate(1.2) contrast(1.05)',
              }}
            />
          </div>
        );
      })}

      {/* Animated background shapes */}
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${c.secondary}20, ${c.accent}20)`,
          top: -200,
          right: -200,
          transform: `rotate(${bgRotate}deg)`
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${c.accent}15, ${c.secondary}15)`,
          bottom: -150,
          left: -150,
          transform: `rotate(${-bgRotate}deg)`
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
          padding: 60,
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Author */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 40,
            transform: `scale(${authorScale}) rotate(${authorRotate}deg)`,
            opacity: authorScale
          }}
        >
          {tweetData.author.profilePicUrl && (
            <Img
              src={tweetData.author.profilePicUrl}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: `4px solid ${c.accent}`,
                objectFit: 'cover'
              }}
            />
          )}
          <div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: c.primary,
                fontFamily: 'sans-serif',
                textTransform: 'uppercase',
                letterSpacing: -1
              }}
            >
              {tweetData.author.name}
            </div>
            <div
              style={{
                fontSize: 20,
                color: c.secondary,
                fontFamily: 'sans-serif',
                fontWeight: 700
              }}
            >
              {tweetData.author.username}
            </div>
          </div>
        </div>

        {/* Kinetic text */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
            maxWidth: 700,
            marginBottom: 40
          }}
        >
          {words.map((word, index) => {
            const wordStartFrame = t.textDelay + (index * t.wordDelay);

            const wordSpring = spring({
              frame: frame - wordStartFrame,
              fps,
              config: {
                damping: 100,
                stiffness: 200
              }
            });

            const wordScale = interpolate(
              wordSpring,
              [0, 1],
              [0, 1],
              { extrapolateRight: 'clamp' }
            );

            const wordRotate = interpolate(
              wordSpring,
              [0, 1],
              [Math.random() * 30 - 15, 0],
              { extrapolateRight: 'clamp' }
            );

            // Cycle through colors based on timing
            const colorOpacity = interpolate(
              frame,
              [wordStartFrame, wordStartFrame + 15],
              [0, 1],
              { extrapolateRight: 'clamp' }
            );

            const wordColor = frame > wordStartFrame + 15 ? c.primary : c.accent;

            return (
              <span
                key={index}
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: wordColor,
                  fontFamily: 'sans-serif',
                  transform: `scale(${wordScale}) rotate(${wordRotate}deg)`,
                  opacity: wordScale,
                  display: 'inline-block',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
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
                [0.8, 1],
                { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) }
              )})`
            }}
          >
            {tweetData.media.map((item, index) => (
              <Img
                key={index}
                src={item.url}
                style={{
                  width: tweetData.media!.length === 1 ? 400 : 250,
                  height: tweetData.media!.length === 1 ? 300 : 200,
                  objectFit: 'cover',
                  borderRadius: 20,
                  border: `6px solid ${c.accent}`,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accent bars */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(90deg, ${c.secondary}, ${c.accent})`,
          transform: `scaleX(${interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })})`
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(90deg, ${c.accent}, ${c.secondary})`,
          transform: `scaleX(${interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })})`
        }}
      />
    </AbsoluteFill>
  );
};
