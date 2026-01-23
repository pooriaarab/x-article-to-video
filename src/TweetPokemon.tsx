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
    charsPerFrame: number;
  };
}

export const TweetPokemon: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#FFCB05',
    secondary: '#3D7DCA',
    background: '#FFFFFF',
    accent: '#FF0000'
  };

  const charsPerFrame = Math.max(0.5, timing?.charsPerFrame || 1.5);
  const textDelay = Math.max(0, timing?.textDelay || 15);

  // Typewriter effect
  const totalChars = tweetData.text.length;
  const visibleChars = Math.floor(
    interpolate(
      frame,
      [textDelay, textDelay + (totalChars / charsPerFrame)],
      [0, totalChars],
      { extrapolateRight: 'clamp' }
    )
  );

  // Pokeball shake animation
  const shakeScale = spring({
    frame: frame % 60,
    fps,
    config: {
      damping: 8,
      stiffness: 150,
    }
  });

  return (
    <AbsoluteFill style={{ background: c.background }}>
      {/* Top red bar (Pokedex style) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        background: c.accent,
        display: 'flex',
        alignItems: 'center',
        padding: '0 30px',
        borderBottom: `4px solid ${c.primary}`,
      }}>
        {/* Pokeball indicator lights */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: frame % 60 < 30 ? c.primary : '#800000',
            border: '2px solid #000000',
            boxShadow: `0 0 10px ${frame % 60 < 30 ? c.primary : 'transparent'}`,
          }} />
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: frame % 40 < 20 ? '#00FF00' : '#004400',
            border: '2px solid #000000',
          }} />
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: frame % 50 < 25 ? c.secondary : '#000044',
            border: '2px solid #000000',
          }} />
        </div>
      </div>

      {/* Main text box (Pokedex screen style) */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 40,
        right: 40,
        background: '#F0F0F0',
        border: '8px solid #000000',
        borderRadius: 20,
        padding: 30,
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          fontSize: 32,
          lineHeight: 1.8,
          color: '#000000',
          fontFamily: 'monospace',
          minHeight: 200,
        }}>
          {tweetData.text.slice(0, visibleChars)}
          {visibleChars < totalChars && (
            <span style={{
              opacity: Math.sin(frame / 10) * 0.5 + 0.5,
              marginLeft: 4,
            }}>
              ▼
            </span>
          )}
        </div>
      </div>

      {/* Pokeball decoration */}
      <div style={{
        position: 'absolute',
        bottom: 120,
        right: 60,
        width: 120,
        height: 120,
        transform: `scale(${1 + shakeScale * 0.1}) rotate(${Math.sin(frame / 20) * 10}deg)`,
      }}>
        {/* Top half */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: c.accent,
          borderRadius: '120px 120px 0 0',
          border: '6px solid #000000',
          borderBottom: 'none',
        }} />
        {/* Bottom half */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: c.background,
          borderRadius: '0 0 120px 120px',
          border: '6px solid #000000',
          borderTop: 'none',
        }} />
        {/* Center band */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 12,
          background: '#000000',
          transform: 'translateY(-50%)',
        }} />
        {/* Center button */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: c.background,
          border: '6px solid #000000',
          transform: 'translate(-50%, -50%)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
        }} />
      </div>

      {/* Author trainer card */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 40,
        background: c.primary,
        border: '6px solid #000000',
        borderRadius: 15,
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
        opacity: interpolate(
          frame,
          [textDelay + (totalChars / charsPerFrame), textDelay + (totalChars / charsPerFrame) + 20],
          [0, 1],
          { extrapolateRight: 'clamp' }
        ),
      }}>
        {tweetData.author.profilePicUrl && (
          <Img
            src={tweetData.author.profilePicUrl}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: '4px solid #000000',
            }}
          />
        )}
        <div>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#000000',
            fontFamily: 'monospace',
            marginBottom: 4,
          }}>
            TRAINER
          </div>
          <div style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#000000',
            fontFamily: 'monospace',
          }}>
            {tweetData.author.name}
          </div>
          <div style={{
            fontSize: 14,
            color: '#333',
            fontFamily: 'monospace',
          }}>
            {tweetData.author.username}
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        right: 240,
        display: 'flex',
        gap: 15,
      }}>
        {['A', 'B'].map((btn) => (
          <div
            key={btn}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: btn === 'A' ? c.accent : c.secondary,
              border: '5px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 900,
              color: '#FFFFFF',
              fontFamily: 'monospace',
              textShadow: '2px 2px 0 #000000',
              boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.3), 0 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            {btn}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
