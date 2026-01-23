import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, Easing, spring, Sequence } from "remotion";

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
    wordDelay: number;
    cutSpeed: number;
  };
}

export const TweetZoomCut: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDuration } = useVideoConfig();

  const c = colors || {
    primary: '#FFFFFF',
    secondary: '#FFD700',
    background: '#000000',
    accent: '#FF4500'
  };

  // Safe timing with proper defaults for this style
  const cutSpeed = Math.max(5, timing?.cutSpeed || timing?.wordDelay || 8);
  const wordDelay = Math.max(1, timing?.wordDelay || 5);

  // Split text into words
  const words = (tweetData.text || '').split(' ').filter(w => w.length > 0);

  // Calculate which word to show based on fast cuts
  const safeCutSpeed = Math.max(1, cutSpeed);
  const currentWordIndex = Math.floor(frame / safeCutSpeed) % Math.max(1, words.length);
  const currentWord = words[currentWordIndex] || '';
  const wordProgress = (frame % safeCutSpeed) / safeCutSpeed;

  // Extreme zoom effect for each word
  const zoomScale = spring({
    frame: frame % safeCutSpeed,
    fps,
    config: {
      damping: 8,
      stiffness: 200,
      mass: 0.3
    }
  });

  const scale = interpolate(zoomScale, [0, 1], [3, 1]);

  // Rotation for drama
  const rotation = interpolate(wordProgress, [0, 1], [10, 0], { easing: Easing.out(Easing.ease) });

  // Background images with Ken Burns effect
  const bgImageIndex = Math.floor(frame / 30) % ((aiImages?.length || 0) + (tweetData.media?.length || 0));
  const allMedia = [
    ...(aiImages || []).map(img => img.url),
    ...(tweetData.media || []).map(m => m.url)
  ];

  const bgScale = interpolate(
    frame % 30,
    [0, 30],
    [1, 1.2],
    { extrapolateRight: 'clamp' }
  );

  // Glitch effect on cut transitions
  const isTransition = wordProgress < 0.1;
  const glitchOffset = isTransition ? (Math.random() - 0.5) * 20 : 0;

  // RGB split effect
  const rgbSplitIntensity = interpolate(wordProgress, [0, 0.15], [10, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* Background media with zoom */}
      {allMedia.length > 0 && allMedia[bgImageIndex] && (
        <div style={{
          position: 'absolute',
          inset: -50,
          overflow: 'hidden',
        }}>
          <Img
            src={allMedia[bgImageIndex]}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${bgScale})`,
              filter: 'brightness(0.4) blur(2px)',
            }}
          />
        </div>
      )}

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle, transparent 40%, #00000099 100%)',
      }} />

      {/* Main word with extreme zoom */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale}) rotate(${rotation}deg) translateX(${glitchOffset}px)`,
      }}>
        {/* RGB split effect */}
        <div style={{ position: 'relative' }}>
          {/* Red channel */}
          <h1 style={{
            position: 'absolute',
            fontSize: 120,
            fontWeight: 900,
            color: '#FF0000',
            fontFamily: 'Impact, sans-serif',
            textTransform: 'uppercase',
            textAlign: 'center',
            margin: 0,
            letterSpacing: -2,
            transform: `translateX(${-rgbSplitIntensity}px)`,
            mixBlendMode: 'screen',
            WebkitTextStroke: `3px ${c.accent}`,
          }}>
            {currentWord}
          </h1>

          {/* Green channel */}
          <h1 style={{
            position: 'absolute',
            fontSize: 120,
            fontWeight: 900,
            color: '#00FF00',
            fontFamily: 'Impact, sans-serif',
            textTransform: 'uppercase',
            textAlign: 'center',
            margin: 0,
            letterSpacing: -2,
            mixBlendMode: 'screen',
          }}>
            {currentWord}
          </h1>

          {/* Blue channel */}
          <h1 style={{
            position: 'absolute',
            fontSize: 120,
            fontWeight: 900,
            color: '#0000FF',
            fontFamily: 'Impact, sans-serif',
            textTransform: 'uppercase',
            textAlign: 'center',
            margin: 0,
            letterSpacing: -2,
            transform: `translateX(${rgbSplitIntensity}px)`,
            mixBlendMode: 'screen',
          }}>
            {currentWord}
          </h1>

          {/* Main white text */}
          <h1 style={{
            position: 'relative',
            fontSize: 120,
            fontWeight: 900,
            color: c.primary,
            fontFamily: 'Impact, sans-serif',
            textTransform: 'uppercase',
            textAlign: 'center',
            margin: 0,
            letterSpacing: -2,
            textShadow: `
              0 0 20px ${c.secondary},
              0 0 40px ${c.secondary},
              0 10px 30px rgba(0,0,0,0.8)
            `,
            WebkitTextStroke: `2px ${c.background}`,
          }}>
            {currentWord}
          </h1>
        </div>
      </div>

      {/* Author badge at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        background: c.accent,
        padding: '12px 24px',
        borderRadius: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        {tweetData.author.profilePicUrl && (
          <Img
            src={tweetData.author.profilePicUrl}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: `2px solid ${c.primary}`,
            }}
          />
        )}
        <span style={{
          fontSize: 16,
          fontWeight: 700,
          color: c.primary,
          fontFamily: 'Arial, sans-serif',
        }}>
          {tweetData.author.username}
        </span>
      </div>

      {/* Progress indicator */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        height: 4,
        background: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${(currentWordIndex / words.length) * 100}%`,
          height: '100%',
          background: c.secondary,
          transition: 'width 0.1s linear',
        }} />
      </div>

      {/* Word counter */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 40,
        fontSize: 24,
        fontWeight: 700,
        color: c.secondary,
        fontFamily: 'monospace',
        textShadow: `0 2px 10px rgba(0,0,0,0.8)`,
      }}>
        {currentWordIndex + 1}/{words.length}
      </div>
    </AbsoluteFill>
  );
};
