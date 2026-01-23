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
}

export const TweetGlitchVHS: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const c = colors || {
    primary: '#FF00FF',
    secondary: '#00FFFF',
    background: '#0A0014',
    accent: '#FFD700'
  };

  // Split text into lines
  const words = (tweetData.text || '').split(' ').filter(w => w.length > 0);
  const linesPerScreen = 3;
  const lines: string[][] = [];
  for (let i = 0; i < words.length; i += linesPerScreen) {
    lines.push(words.slice(i, i + linesPerScreen));
  }

  const currentLineIndex = Math.floor(frame / 45) % lines.length;
  const currentLine = lines[currentLineIndex]?.join(' ') || '';

  // VHS tracking issues
  const trackingOffset = frame % 5 === 0 ? (Math.random() - 0.5) * 4 : 0;

  // Random glitch every few frames
  const isGlitching = frame % 20 < 3;
  const glitchIntensity = isGlitching ? Math.random() * 30 : 0;

  // Color separation
  const colorSeparation = isGlitching ? 8 : 2;

  // Scanline position
  const scanlineY = (frame * 5) % 1080;

  // VHS timestamp
  const hours = Math.floor(frame / (fps * 3600)) % 24;
  const minutes = Math.floor((frame / (fps * 60)) % 60);
  const seconds = Math.floor((frame / fps) % 60);
  const timestamp = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Background media with VHS effect
  const allMedia = [
    ...(aiImages || []).map(img => img.url),
    ...(tweetData.media || []).map(m => m.url)
  ];

  const bgImageIndex = Math.floor(frame / 60) % (allMedia.length || 1);

  // Static noise
  const noiseOpacity = interpolate(Math.random(), [0, 1], [0.05, 0.15]);

  // Tape wobble
  const wobble = Math.sin(frame / 3) * 2;

  return (
    <AbsoluteFill style={{ background: c.background, overflow: 'hidden' }}>
      {/* Background image with VHS distortion */}
      {allMedia[bgImageIndex] && (
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${wobble}px)`,
        }}>
          <Img
            src={allMedia[bgImageIndex]}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: `
                hue-rotate(${frame * 2}deg)
                saturate(1.5)
                contrast(1.2)
                brightness(0.4)
              `,
              transform: `scale(${1.1 + wobble / 100})`,
            }}
          />
        </div>
      )}

      {/* Analog static noise */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            rgba(255,255,255,${noiseOpacity}) 1px,
            transparent 2px
          )
        `,
        mixBlendMode: 'overlay',
        opacity: 0.3,
      }} />

      {/* Horizontal scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.15) 0px,
            transparent 1px,
            transparent 2px
          )
        `,
      }} />

      {/* Moving scanline */}
      <div style={{
        position: 'absolute',
        top: scanlineY,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(to bottom, transparent, ${c.secondary}88, transparent)`,
        boxShadow: `0 0 10px ${c.secondary}`,
      }} />

      {/* Main text with glitch */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        transform: `translateX(${trackingOffset + glitchIntensity}px)`,
      }}>
        {/* Red channel */}
        <div style={{
          position: 'absolute',
          fontSize: 72,
          fontWeight: 900,
          color: '#FF0000',
          fontFamily: 'Courier New, monospace',
          textTransform: 'uppercase',
          textAlign: 'center',
          transform: `translateX(${-colorSeparation}px) skew(-2deg)`,
          mixBlendMode: 'screen',
          opacity: 0.8,
        }}>
          {currentLine}
        </div>

        {/* Cyan channel */}
        <div style={{
          position: 'absolute',
          fontSize: 72,
          fontWeight: 900,
          color: c.secondary,
          fontFamily: 'Courier New, monospace',
          textTransform: 'uppercase',
          textAlign: 'center',
          transform: `translateX(${colorSeparation}px) skew(2deg)`,
          mixBlendMode: 'screen',
          opacity: 0.8,
        }}>
          {currentLine}
        </div>

        {/* Main text */}
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          color: c.primary,
          fontFamily: 'Courier New, monospace',
          textTransform: 'uppercase',
          textAlign: 'center',
          textShadow: `
            0 0 20px ${c.primary},
            0 0 40px ${c.accent}
          `,
          WebkitTextStroke: '1px rgba(0,0,0,0.5)',
          letterSpacing: 2,
        }}>
          {currentLine}
        </div>
      </div>

      {/* VHS UI overlays */}
      {/* Top left: REC indicator */}
      <div style={{
        position: 'absolute',
        top: 30,
        left: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: 'Courier New, monospace',
        fontSize: 20,
        fontWeight: 700,
        color: '#FF0000',
        textShadow: '0 0 10px #FF0000',
      }}>
        <div style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#FF0000',
          boxShadow: '0 0 15px #FF0000',
          opacity: frame % 30 < 15 ? 1 : 0.3,
        }} />
        REC
      </div>

      {/* Top right: Timestamp */}
      <div style={{
        position: 'absolute',
        top: 30,
        right: 30,
        fontFamily: 'Courier New, monospace',
        fontSize: 24,
        fontWeight: 700,
        color: c.accent,
        textShadow: `0 0 10px ${c.accent}`,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '8px 16px',
        borderRadius: 4,
      }}>
        {timestamp}
      </div>

      {/* Bottom left: Author */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 16,
        borderRadius: 8,
        border: `2px solid ${c.primary}`,
        transform: `translateY(${interpolate(frame, [0, 20], [100, 0], { extrapolateRight: 'clamp' })}px)`,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        {tweetData.author.profilePicUrl && (
          <Img
            src={tweetData.author.profilePicUrl}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              border: `2px solid ${c.secondary}`,
              filter: 'saturate(1.5) contrast(1.2)',
            }}
          />
        )}
        <div>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: c.primary,
            fontFamily: 'Courier New, monospace',
          }}>
            {tweetData.author.name}
          </div>
          <div style={{
            fontSize: 14,
            color: c.secondary,
            fontFamily: 'Courier New, monospace',
          }}>
            {tweetData.author.username}
          </div>
        </div>
      </div>

      {/* Tracking issues overlay */}
      {isGlitching && (
        <div style={{
          position: 'absolute',
          left: Math.random() * 500,
          top: Math.random() * 800,
          width: 400,
          height: 100,
          background: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.3)`,
          mixBlendMode: 'difference',
        }} />
      )}

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle, transparent 50%, #000000aa 100%)',
        pointerEvents: 'none',
      }} />

      {/* VHS tape counter */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        right: 40,
        fontFamily: 'Courier New, monospace',
        fontSize: 16,
        color: c.accent,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: '8px 12px',
        borderRadius: 4,
        textShadow: `0 0 8px ${c.accent}`,
      }}>
        {Math.floor(frame).toString().padStart(6, '0')}
      </div>
    </AbsoluteFill>
  );
};
