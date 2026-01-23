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
  durationInFrames?: number;
  aiImages?: Array<{ url: string; startFrame: number }>;
  colors?: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
  timing?: {
    textDelay: number;
    bubbleDelay: number;
  };
}

export const TweetComicBook: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#000000',
    secondary: '#FF0000',
    background: '#FFEB3B',
    accent: '#2196F3'
  };

  // Split text into sentences for speech bubbles
  const sentences = tweetData.text.match(/[^.!?]+[.!?]+/g) || [tweetData.text];

  // Comic effects
  const impactWords = ['POW', 'BAM', 'BOOM', 'ZAP', 'WHAM'];
  const randomImpact = impactWords[Math.floor(frame / 30) % impactWords.length];

  // Impact scale animation
  const impactScale = spring({
    frame: frame % 30,
    fps,
    config: {
      damping: 10,
      stiffness: 150,
    }
  });

  return (
    <AbsoluteFill style={{
      background: c.background,
      fontFamily: 'Impact, sans-serif',
    }}>
      {/* Comic book dot pattern overlay */}
      <svg style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="2" fill="rgba(0,0,0,0.15)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Speech bubble with text */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: 700,
      }}>
        {sentences.map((sentence, idx) => {
          const bubbleFrame = frame - (idx * 40);
          const bubbleOpacity = interpolate(
            bubbleFrame,
            [0, 15],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );
          const bubbleY = interpolate(
            bubbleFrame,
            [0, 15],
            [50, 0],
            { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) }
          );

          return (
            <div
              key={idx}
              style={{
                position: 'relative',
                background: '#FFFFFF',
                border: `6px solid ${c.primary}`,
                borderRadius: 30,
                padding: 30,
                marginBottom: 20,
                opacity: bubbleOpacity,
                transform: `translateY(${bubbleY}px)`,
                boxShadow: '8px 8px 0 rgba(0,0,0,0.3)',
              }}
            >
              <div style={{
                fontSize: 32,
                lineHeight: 1.4,
                color: c.primary,
                fontWeight: 900,
                textTransform: 'uppercase',
              }}>
                {sentence.trim()}
              </div>

              {/* Speech bubble tail */}
              <div style={{
                position: 'absolute',
                bottom: -30,
                left: 60,
                width: 0,
                height: 0,
                borderLeft: '25px solid transparent',
                borderRight: '25px solid transparent',
                borderTop: `30px solid ${c.primary}`,
              }} />
              <div style={{
                position: 'absolute',
                bottom: -21,
                left: 67,
                width: 0,
                height: 0,
                borderLeft: '18px solid transparent',
                borderRight: '18px solid transparent',
                borderTop: '24px solid #FFFFFF',
              }} />
            </div>
          );
        })}
      </div>

      {/* Impact word effect */}
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${impactScale}) rotate(${Math.sin(frame / 10) * 5}deg)`,
        fontSize: 120,
        fontWeight: 900,
        color: c.secondary,
        textShadow: `
          4px 4px 0 ${c.primary},
          8px 8px 0 ${c.accent},
          0 0 30px ${c.secondary}
        `,
        WebkitTextStroke: `3px ${c.primary}`,
        letterSpacing: 8,
      }}>
        {randomImpact}!
      </div>

      {/* Star burst effect */}
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * 360;
          const length = interpolate(
            frame % 30,
            [0, 15, 30],
            [0, 150, 0],
            { extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 8,
                height: length,
                background: `linear-gradient(to bottom, ${c.secondary}, transparent)`,
                transformOrigin: 'top center',
                transform: `rotate(${angle}deg)`,
                left: -4,
              }}
            />
          );
        })}
      </div>

      {/* Author in comic style badge */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        background: c.accent,
        border: `5px solid ${c.primary}`,
        borderRadius: 50,
        padding: '15px 30px',
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
        opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        {tweetData.author.profilePicUrl && (
          <Img
            src={tweetData.author.profilePicUrl}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              border: `4px solid ${c.primary}`,
              filter: 'contrast(1.2) saturate(1.3)',
            }}
          />
        )}
        <div>
          <div style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#FFFFFF',
            textShadow: `2px 2px 0 ${c.primary}`,
          }}>
            {tweetData.author.name}
          </div>
          <div style={{
            fontSize: 16,
            color: c.primary,
            fontWeight: 700,
          }}>
            {tweetData.author.username}
          </div>
        </div>
      </div>

      {/* Comic book panel borders */}
      <div style={{
        position: 'absolute',
        inset: 10,
        border: `8px solid ${c.primary}`,
        borderRadius: 8,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
