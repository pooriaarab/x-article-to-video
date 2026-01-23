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

export const TweetSubwaySurfers: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#FFFFFF',
    secondary: '#FFD700',
    background: '#000000',
    accent: '#FF6B00'
  };

  const scrollSpeed = Math.max(1, timing?.scrollSpeed || timing?.textDelay || 2);

  // Split text into words
  const words = (tweetData.text || '').split(' ');

  // Word-by-word reveal with smooth scroll
  const wordsPerScreen = 3;
  const framesPerWord = 20;
  const currentWordSet = Math.floor(frame / framesPerWord);
  const startIdx = Math.max(0, currentWordSet - wordsPerScreen);
  const visibleWords = words.slice(startIdx, currentWordSet + 1);

  // Gameplay background scroll
  const bgScroll = (frame * scrollSpeed) % 1080;

  // Background images as "gameplay"
  const allMedia = [
    ...(aiImages || []).map(img => img.url),
    ...(tweetData.media || []).map(m => m.url)
  ];

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* Gameplay area (bottom 40%) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        overflow: 'hidden',
        borderTop: `4px solid ${c.accent}`,
      }}>
        {allMedia.length > 0 ? (
          <div style={{
            position: 'absolute',
            inset: 0,
            transform: `translateY(${-bgScroll}px)`,
          }}>
            {/* Repeat images for infinite scroll effect */}
            {[0, 1, 2].map(repeat => (
              <div key={repeat} style={{ position: 'relative' }}>
                {allMedia.map((url, idx) => (
                  <Img
                    key={`${repeat}-${idx}`}
                    src={url}
                    style={{
                      width: '100%',
                      height: 360,
                      objectFit: 'cover',
                      filter: 'brightness(0.6) saturate(1.3)',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          // Fallback animated pattern
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              repeating-linear-gradient(
                0deg,
                ${c.accent}33 0px,
                transparent 10px,
                transparent 20px
              )
            `,
            transform: `translateY(${-bgScroll}px)`,
          }} />
        )}

        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to top, transparent, ${c.background}ee)`,
        }} />
      </div>

      {/* Text content area (top 60%) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 40,
        background: `linear-gradient(to bottom, ${c.background}, transparent)`,
      }}>
        {/* Words appearing one by one */}
        <div style={{
          fontSize: 48,
          fontWeight: 900,
          lineHeight: 1.4,
          color: c.primary,
          fontFamily: 'Impact, sans-serif',
          textTransform: 'uppercase',
          textAlign: 'center',
          textShadow: `
            3px 3px 0 ${c.background},
            -1px -1px 0 ${c.background},
            1px -1px 0 ${c.background},
            -1px 1px 0 ${c.background},
            1px 1px 0 ${c.background},
            0 0 20px ${c.secondary}
          `,
        }}>
          {visibleWords.map((word, idx) => {
            const wordFrame = (currentWordSet - (startIdx + idx)) * framesPerWord;
            const wordOpacity = interpolate(
              wordFrame,
              [0, 10],
              [0, 1],
              { extrapolateRight: 'clamp' }
            );
            const wordScale = interpolate(
              wordFrame,
              [0, 10],
              [0.8, 1],
              { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) }
            );

            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  marginRight: 16,
                  opacity: wordOpacity,
                  transform: `scale(${wordScale})`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Author badge */}
        <div style={{
          marginTop: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {tweetData.author.profilePicUrl && (
            <Img
              src={tweetData.author.profilePicUrl}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                border: `3px solid ${c.secondary}`,
              }}
            />
          )}
          <div>
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: c.secondary,
              fontFamily: 'Arial, sans-serif',
            }}>
              {tweetData.author.name}
            </div>
            <div style={{
              fontSize: 16,
              color: c.primary,
              fontFamily: 'Arial, sans-serif',
            }}>
              {tweetData.author.username}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      {/* Score counter (fake) */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        fontSize: 32,
        fontWeight: 900,
        color: c.secondary,
        fontFamily: 'Impact, sans-serif',
        textShadow: `2px 2px 0 ${c.background}`,
      }}>
        {Math.floor(frame * 10)}
      </div>
    </AbsoluteFill>
  );
};
