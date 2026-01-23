import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, random } from "remotion";

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
  colors?: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
  timing?: {
    textDelay: number;
    charsPerFrame: number;
  };
}

export const TweetMatrix: React.FC<Props> = ({ tweetData, durationInFrames, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#00FF00',
    secondary: '#008F00',
    background: '#000000',
    accent: '#FFFFFF'
  };

  const charsPerFrame = Math.max(0.5, timing?.charsPerFrame || 2);
  const textDelay = Math.max(0, timing?.textDelay || 30);

  // Matrix rain effect
  const columns = 40;
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';

  const columnData = Array.from({ length: columns }, (_, i) => {
    const x = (i / columns) * 100;
    const speed = 0.5 + random(`speed-${i}`) * 2;
    const chars: Array<{char: string; opacity: number}> = [];

    for (let j = 0; j < 30; j++) {
      const y = ((frame * speed + j * 40 + i * 100) % 1200) - 100;
      const charIndex = Math.floor(random(`char-${i}-${j}-${Math.floor(frame / 10)}`) * matrixChars.length);
      const opacity = j === 0 ? 1 : 0.3 - (j * 0.01);

      chars.push({
        char: matrixChars[charIndex],
        opacity: Math.max(0, opacity),
      });
    }

    return { x, chars };
  });

  // Text reveal character by character
  const totalChars = tweetData.text.length;
  const visibleChars = Math.floor(
    interpolate(
      frame,
      [textDelay, textDelay + (totalChars / charsPerFrame)],
      [0, totalChars],
      { extrapolateRight: 'clamp' }
    )
  );

  return (
    <AbsoluteFill style={{
      background: c.background,
      fontFamily: 'Courier New, monospace',
    }}>
      {/* Matrix rain background */}
      {columnData.map((col, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${col.x}%`,
            top: 0,
            fontSize: 20,
            color: c.secondary,
            lineHeight: '24px',
            opacity: 0.8,
          }}
        >
          {col.chars.map((charData, j) => (
            <div
              key={j}
              style={{
                opacity: charData.opacity,
                color: j === 0 ? c.primary : c.secondary,
                textShadow: j === 0 ? `0 0 10px ${c.primary}` : 'none',
              }}
            >
              {charData.char}
            </div>
          ))}
        </div>
      ))}

      {/* Central text area */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        background: 'radial-gradient(circle, rgba(0,0,0,0.9), transparent 70%)',
      }}>
        <div style={{
          fontSize: 36,
          lineHeight: 1.6,
          color: c.primary,
          fontFamily: 'Courier New, monospace',
          textShadow: `0 0 20px ${c.primary}`,
          textAlign: 'center',
          maxWidth: 800,
        }}>
          {tweetData.text.slice(0, visibleChars).split('').map((char, idx) => {
            const glitch = random(`glitch-${idx}-${Math.floor(frame / 5)}`) > 0.95;
            const glitchChar = glitch ? matrixChars[Math.floor(random(`gc-${idx}-${frame}`) * matrixChars.length)] : char;

            return (
              <span
                key={idx}
                style={{
                  opacity: random(`opacity-${idx}`) > 0.1 ? 1 : 0.3,
                  color: glitch ? c.accent : c.primary,
                }}
              >
                {glitchChar}
              </span>
            );
          })}
          {visibleChars < totalChars && (
            <span style={{
              opacity: Math.sin(frame / 10) * 0.5 + 0.5,
              textShadow: `0 0 15px ${c.primary}`,
            }}>
              █
            </span>
          )}
        </div>

        {/* Author */}
        <div style={{
          marginTop: 50,
          fontSize: 20,
          color: c.primary,
          textShadow: `0 0 10px ${c.primary}`,
          opacity: interpolate(
            frame,
            [textDelay + (totalChars / charsPerFrame), textDelay + (totalChars / charsPerFrame) + 20],
            [0, 1],
            { extrapolateRight: 'clamp' }
          ),
        }}>
          {'>'} {tweetData.author.name} - {tweetData.author.username}
        </div>
      </div>

      {/* Scan line effect */}
      <div style={{
        position: 'absolute',
        top: (frame * 5) % 1080,
        left: 0,
        right: 0,
        height: 2,
        background: c.primary,
        opacity: 0.3,
        boxShadow: `0 0 10px ${c.primary}`,
      }} />

      {/* Terminal prompt */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        fontSize: 16,
        color: c.primary,
        fontFamily: 'Courier New, monospace',
        opacity: 0.7,
      }}>
        {'root@matrix:~$ cat tweet.txt'}
      </div>
    </AbsoluteFill>
  );
};
