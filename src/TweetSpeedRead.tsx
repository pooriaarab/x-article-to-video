import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

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
    framesPerWord: number;
    textDelay: number;
  };
}

export const TweetSpeedRead: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#000000',
    secondary: '#FF0000',
    background: '#FFFFFF',
    accent: '#4A90E2'
  };

  // Speed reading timing (default ~200ms per word = 6 frames at 30fps)
  const framesPerWord = Math.max(3, timing?.framesPerWord || timing?.textDelay || 6);

  // Split text into words
  const words = (tweetData.text || '').split(' ').filter(w => w.length > 0);

  // Calculate current word index
  const currentWordIndex = Math.floor(frame / framesPerWord);
  const wordInCycle = currentWordIndex % words.length;
  const currentWord = words[wordInCycle] || '';

  // Find the Optimal Recognition Point (ORP) - typically around 30% into the word
  const getORP = (word: string) => {
    if (word.length <= 1) return 0;
    if (word.length <= 5) return 1;
    return Math.floor(word.length * 0.35);
  };

  const orpIndex = getORP(currentWord);

  // Split word into parts for highlighting
  const beforeORP = currentWord.slice(0, orpIndex);
  const orpChar = currentWord[orpIndex] || '';
  const afterORP = currentWord.slice(orpIndex + 1);

  // Pulse effect on word change
  const wordProgress = (frame % framesPerWord) / framesPerWord;
  const pulseScale = interpolate(
    wordProgress,
    [0, 0.1, 1],
    [1.1, 1, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) }
  );

  // Progress bar
  const progressPercent = ((wordInCycle + 1) / words.length) * 100;

  // Show author at end
  const showAuthor = currentWordIndex >= words.length;
  const authorOpacity = interpolate(
    frame,
    [words.length * framesPerWord, words.length * framesPerWord + 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Guide lines for focus
  const guideOpacity = interpolate(frame, [0, 15], [0, 0.3], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      background: c.background,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Focus guide lines */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 2,
        height: 60,
        background: c.accent,
        transform: 'translate(-50%, -50%)',
        opacity: guideOpacity,
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 60,
        height: 2,
        background: c.accent,
        transform: 'translate(-50%, -50%)',
        opacity: guideOpacity,
      }} />

      {/* Main word display */}
      {!showAuthor && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${pulseScale})`,
        }}>
          <div style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: 2,
          }}>
            {/* Before ORP */}
            <span style={{ color: c.primary }}>
              {beforeORP}
            </span>
            {/* ORP character - highlighted */}
            <span style={{
              color: c.secondary,
              textShadow: `0 0 20px ${c.secondary}`,
              transform: 'scale(1.2)',
              display: 'inline-block',
            }}>
              {orpChar}
            </span>
            {/* After ORP */}
            <span style={{ color: c.primary }}>
              {afterORP}
            </span>
          </div>
        </div>
      )}

      {/* Author card at end */}
      {showAuthor && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          opacity: authorOpacity,
        }}>
          <div style={{
            fontSize: 48,
            fontWeight: 700,
            color: c.primary,
          }}>
            {tweetData.author.name}
          </div>
          <div style={{
            fontSize: 32,
            color: c.secondary,
          }}>
            {tweetData.author.username}
          </div>
          <div style={{
            marginTop: 20,
            fontSize: 24,
            color: c.accent,
            fontStyle: 'italic',
          }}>
            {words.length} words read
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 8,
        background: `rgba(0,0,0,0.1)`,
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(100, progressPercent)}%`,
          background: `linear-gradient(90deg, ${c.accent}, ${c.secondary})`,
          transition: 'width 0.1s linear',
          boxShadow: `0 0 20px ${c.accent}`,
        }} />
      </div>

      {/* Word counter */}
      <div style={{
        position: 'absolute',
        top: 30,
        right: 30,
        fontSize: 24,
        fontWeight: 600,
        color: c.primary,
        opacity: 0.5,
        fontFamily: 'monospace',
      }}>
        {wordInCycle + 1}/{words.length}
      </div>

      {/* WPM indicator */}
      <div style={{
        position: 'absolute',
        top: 30,
        left: 30,
        fontSize: 20,
        fontWeight: 600,
        color: c.accent,
        opacity: 0.6,
      }}>
        {Math.round((fps / framesPerWord) * 60)} WPM
      </div>

      {/* Breathing indicator (helps pace) */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: c.accent,
        opacity: interpolate(
          wordProgress,
          [0, 0.5, 1],
          [0.3, 0.8, 0.3],
          { extrapolateRight: 'clamp' }
        ),
        boxShadow: `0 0 20px ${c.accent}`,
      }} />
    </AbsoluteFill>
  );
};
