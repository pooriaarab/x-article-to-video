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

export const TweetTikTok: React.FC<Props> = ({ tweetData, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // TikTok-style colors (black background with white/yellow captions)
  const c = colors || {
    primary: '#FFFFFF',
    secondary: '#FEE500',
    background: '#000000',
    accent: '#FF0050'
  };

  const t = timing || {
    textDelay: 15,
    imageDelay: 60,
    wordDelay: 2
  };

  // Split text into words for word-by-word animation
  const words = (tweetData.text || '').split(' ').filter(w => w.length > 0);
  const totalWords = Math.max(1, words.length);

  // Fast-paced word animation with safe defaults
  const safeWordDelay = Math.max(1, t.wordDelay || 2);
  const wordAnimationDuration = totalWords * safeWordDelay;

  const wordsToShow = Math.min(
    totalWords,
    Math.floor(interpolate(
      frame,
      [t.textDelay, t.textDelay + wordAnimationDuration],
      [0, totalWords],
      { extrapolateRight: 'clamp' }
    ))
  );

  // Avatar zoom in
  const avatarScale = interpolate(
    frame,
    [0, 20],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) }
  );

  // Subtle background pulse
  const bgPulse = interpolate(
    Math.sin(frame / 10),
    [-1, 1],
    [0.95, 1.05]
  );

  // Bottom caption bar slide up
  const captionSlide = interpolate(
    frame,
    [5, 25],
    [100, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) }
  );

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* AI Generated Images - Full Screen with Fast Transitions */}
      {aiImages && aiImages.map((img, idx) => {
        const showStart = img.startFrame;
        const showEnd = img.startFrame + 90;

        if (frame < showStart || frame > showEnd) return null;

        // Fast fade in/out for TikTok style
        const imageOpacity = interpolate(
          frame,
          [showStart, showStart + 8, showEnd - 8, showEnd],
          [0, 0.25, 0.25, 0],
          { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
        );

        // Zoom effect
        const scale = interpolate(
          frame,
          [showStart, showEnd],
          [1.1, 1.3],
          { extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: imageOpacity,
            }}
          >
            <Img
              src={img.url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${scale})`,
              }}
            />
            {/* Dark overlay for text readability */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
            }} />
          </div>
        );
      })}

      {/* Gradient overlay for depth */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: `scale(${bgPulse})`
        }}
      />

      {/* Author avatar (TikTok style - circular at top) */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: `translateX(-50%) scale(${avatarScale})`,
          zIndex: 2
        }}
      >
        {tweetData.author.profilePicUrl && (
          <Img
            src={tweetData.author.profilePicUrl}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: `4px solid ${c.secondary}`,
              objectFit: 'cover',
              boxShadow: `0 0 30px ${c.secondary}40`
            }}
          />
        )}

        {/* Username badge */}
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: c.accent,
            padding: '6px 16px',
            borderRadius: 20,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}
        >
          {tweetData.author.username}
        </div>
      </div>

      {/* Main text - TikTok caption style (bottom captions) */}
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          left: 0,
          right: 0,
          padding: '0 40px',
          transform: `translateY(${captionSlide}%)`,
          zIndex: 3
        }}
      >
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            padding: '24px 32px',
            borderRadius: 16,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              lineHeight: 1.3,
              textAlign: 'center',
              color: '#FFFFFF',
              textShadow: `3px 3px 0px ${c.accent}, -1px -1px 0px ${c.secondary}`,
              fontFamily: 'Arial Black, sans-serif',
              letterSpacing: '-0.5px'
            }}
          >
            {words.slice(0, wordsToShow).map((word, index) => {
              // Current word gets highlighted
              const isCurrent = index === wordsToShow - 1;
              const wordProgress = interpolate(
                frame,
                [t.textDelay + index * t.wordDelay, t.textDelay + (index + 1) * t.wordDelay],
                [0, 1],
                { extrapolateRight: 'clamp' }
              );

              const wordScale = isCurrent ? interpolate(
                wordProgress,
                [0, 0.5, 1],
                [1.2, 1.1, 1],
                { extrapolateRight: 'clamp' }
              ) : 1;

              return (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    marginRight: 12,
                    transform: `scale(${wordScale})`,
                    color: isCurrent ? c.secondary : c.primary,
                    transition: 'all 0.1s ease'
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom engagement bar (TikTok style UI elements) */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          padding: '0 60px',
          opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' })
        }}
      >
        {['❤️', '💬', '📤'].map((emoji, i) => {
          const popIn = interpolate(
            frame,
            [30 + i * 5, 45 + i * 5],
            [0, 1],
            { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2)) }
          );

          return (
            <div
              key={i}
              style={{
                fontSize: 40,
                transform: `scale(${popIn})`,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
              }}
            >
              {emoji}
            </div>
          );
        })}
      </div>

      {/* Trending up indicator */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          right: 30,
          background: c.accent,
          padding: '10px 20px',
          borderRadius: 25,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' }),
          boxShadow: '0 4px 12px rgba(255, 0, 80, 0.5)'
        }}
      >
        📈 TRENDING
      </div>
    </AbsoluteFill>
  );
};
