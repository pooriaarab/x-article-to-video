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
  timing?: {
    textDelay: number;
    scrollSpeed: number;
  };
}

export const TweetStarWars: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const c = colors || {
    primary: '#FFE81F',
    secondary: '#FFE81F',
    background: '#000000',
    accent: '#4A90E2'
  };

  const scrollSpeed = Math.max(1, timing?.scrollSpeed || timing?.textDelay || 3);

  // Starfield animation
  const stars = Array.from({ length: 200 }, (_, i) => {
    const x = (i * 137.508) % 100; // Golden angle distribution
    const y = ((i * 73.1) % 100);
    const z = (i % 3) + 1; // 3 depth layers
    const size = z === 1 ? 1 : z === 2 ? 2 : 3;
    const speed = z * 0.5;

    const yPos = (y + (frame * speed) / 10) % 110;

    return { x, y: yPos, size, opacity: 0.3 + (z * 0.2) };
  });

  // Opening crawl scroll position
  const crawlY = interpolate(
    frame,
    [0, durationInFrames || 240],
    [height, -2000],
    { extrapolateRight: 'clamp', easing: Easing.linear }
  );

  // "A long time ago..." text fade
  const introOpacity = interpolate(
    frame,
    [0, 30, 60, 90],
    [0, 1, 1, 0],
    { extrapolateRight: 'clamp' }
  );

  // Show crawl after intro
  const crawlOpacity = interpolate(
    frame,
    [90, 110],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* Starfield background */}
      <svg style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {stars.map((star, i) => (
          <circle
            key={i}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="#FFFFFF"
            opacity={star.opacity}
          />
        ))}
      </svg>

      {/* "A long time ago..." intro */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: introOpacity,
      }}>
        <div style={{
          fontSize: 36,
          fontFamily: 'serif',
          color: c.accent,
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          A long time ago in a galaxy far, far away....
        </div>
      </div>

      {/* Opening crawl */}
      <div style={{
        position: 'absolute',
        left: '50%',
        width: '80%',
        transform: `translateX(-50%) translateY(${crawlY}px) perspective(300px) rotateX(25deg)`,
        opacity: crawlOpacity,
      }}>
        {/* Episode title */}
        <div style={{
          fontSize: 48,
          fontWeight: 700,
          color: c.primary,
          textAlign: 'center',
          fontFamily: 'sans-serif',
          marginBottom: 40,
          letterSpacing: 8,
          textShadow: `0 0 20px ${c.primary}`,
        }}>
          EPISODE {Math.floor(Math.random() * 100) + 1}
        </div>

        {/* Tweet text as crawl */}
        <div style={{
          fontSize: 42,
          lineHeight: 1.8,
          color: c.primary,
          textAlign: 'justify',
          fontFamily: 'sans-serif',
          fontWeight: 600,
          textShadow: `0 2px 10px rgba(0,0,0,0.8)`,
          letterSpacing: 2,
          maxWidth: 900,
          margin: '0 auto',
        }}>
          {tweetData.text}
        </div>

        {/* Author attribution */}
        <div style={{
          marginTop: 80,
          fontSize: 32,
          color: c.accent,
          textAlign: 'center',
          fontFamily: 'sans-serif',
          fontStyle: 'italic',
        }}>
          — {tweetData.author.name}
        </div>

        {/* Visual flourish at the end */}
        <div style={{
          marginTop: 100,
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
        }}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: c.primary,
                boxShadow: `0 0 20px ${c.primary}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        background: `linear-gradient(to top, ${c.background}, transparent)`,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
