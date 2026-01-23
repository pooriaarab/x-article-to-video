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
  svgIcon?: string;
  colors?: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
  timing?: {
    deviceDelay: number;
    textDelay: number;
    buttonDelay: number;
  };
}

export const TweetTechnicalExplainer: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, svgIcon, colors, timing }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Default values
  const c = colors || {
    primary: '#1F2937',
    secondary: '#0EA5E9',
    background: '#F8FAFC',
    accent: '#8B5CF6'
  };

  const t = timing || {
    deviceDelay: 10,
    textDelay: 40,
    buttonDelay: 70
  };

  // Split text into words
  const words = tweetData.text.split(' ');

  // Device slide in animation
  const phoneSlide = interpolate(
    frame,
    [t.deviceDelay, t.deviceDelay + 30],
    [-400, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const laptopSlide = interpolate(
    frame,
    [t.deviceDelay + 15, t.deviceDelay + 45],
    [400, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  // Text animation
  const textOpacity = interpolate(
    frame,
    [t.textDelay, t.textDelay + 20],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  // Code/UI elements animation
  const elementsOpacity = interpolate(
    frame,
    [t.buttonDelay, t.buttonDelay + 20],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const elementsScale = interpolate(
    frame,
    [t.buttonDelay, t.buttonDelay + 20],
    [0.9, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  // Connection line animation
  const lineProgress = interpolate(
    frame,
    [t.buttonDelay + 10, t.buttonDelay + 40],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  );

  // Pulsing effect for accent elements
  const pulse = Math.sin(frame / 15) * 0.1 + 1;

  return (
    <AbsoluteFill
      style={{
        background: c.background,
        fontFamily: 'SF Pro Display, -apple-system, sans-serif'
      }}
    >
      {/* Grid background */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={c.primary} strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Connection line between devices */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: c.secondary, stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: c.secondary, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: c.accent, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <line
          x1="350"
          y1={height / 2}
          x2={350 + (370 * lineProgress)}
          y2={height / 2}
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeDasharray="10,5"
        />
      </svg>

      {/* Phone UI (Left) */}
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: height / 2 - 250,
          transform: `translateX(${phoneSlide}px)`,
        }}
      >
        {/* Phone frame */}
        <div
          style={{
            width: 250,
            height: 500,
            background: '#1F2937',
            borderRadius: 40,
            padding: 12,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 100,
              height: 28,
              background: '#1F2937',
              borderRadius: '0 0 20px 20px',
              zIndex: 10
            }}
          />

          {/* Screen */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'white',
              borderRadius: 32,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Status bar */}
            <div
              style={{
                height: 40,
                background: c.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                color: 'white',
                fontSize: 12,
                fontWeight: 600
              }}
            >
              <span>9:41</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 16, height: 16, background: 'white', borderRadius: 2 }} />
                <div style={{ width: 16, height: 16, background: 'white', borderRadius: 2 }} />
              </div>
            </div>

            {/* App content */}
            <div style={{ flex: 1, padding: 16, background: '#F9FAFB' }}>
              {/* Header */}
              <div
                style={{
                  background: 'white',
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 12,
                  opacity: elementsOpacity,
                  transform: `scale(${elementsScale})`
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 600, color: c.primary }}>
                  {tweetData.author.name}
                </div>
                <div style={{ fontSize: 8, color: '#6B7280' }}>
                  {tweetData.author.username}
                </div>
              </div>

              {/* Cards */}
              {words.slice(0, 3).map((word, i) => {
                const cardOpacity = interpolate(
                  frame,
                  [t.textDelay + i * 5, t.textDelay + i * 5 + 15],
                  [0, 1],
                  { extrapolateRight: 'clamp' }
                );

                return (
                  <div
                    key={i}
                    style={{
                      background: 'white',
                      padding: 10,
                      borderRadius: 8,
                      marginBottom: 8,
                      opacity: cardOpacity,
                      border: `2px solid ${i === 0 ? c.secondary : '#E5E7EB'}`,
                      transform: i === 0 ? `scale(${pulse})` : 'scale(1)'
                    }}
                  >
                    <div style={{ fontSize: 9, color: c.primary, fontWeight: 500 }}>
                      {word}
                    </div>
                  </div>
                );
              })}

              {/* Button */}
              <div
                style={{
                  marginTop: 12,
                  background: c.secondary,
                  padding: 12,
                  borderRadius: 8,
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  opacity: elementsOpacity,
                  transform: `scale(${elementsScale})`
                }}
              >
                Execute
              </div>
            </div>
          </div>
        </div>

        {/* Phone label */}
        <div
          style={{
            marginTop: 12,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 600,
            color: c.primary,
            opacity: textOpacity
          }}
        >
          Mobile App
        </div>
      </div>

      {/* Laptop UI (Right) */}
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: height / 2 - 200,
          transform: `translateX(${laptopSlide}px)`,
        }}
      >
        {/* Laptop screen */}
        <div
          style={{
            width: 450,
            height: 280,
            background: '#1F2937',
            borderRadius: 12,
            padding: 8,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}
        >
          {/* Screen */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#1E293B',
              borderRadius: 8,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Browser chrome */}
            <div
              style={{
                height: 32,
                background: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                gap: 6
              }}
            >
              <div style={{ width: 10, height: 10, background: '#EF4444', borderRadius: '50%' }} />
              <div style={{ width: 10, height: 10, background: '#F59E0B', borderRadius: '50%' }} />
              <div style={{ width: 10, height: 10, background: '#10B981', borderRadius: '50%' }} />
              <div
                style={{
                  flex: 1,
                  marginLeft: 16,
                  height: 20,
                  background: '#1E293B',
                  borderRadius: 4,
                  fontSize: 9,
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8
                }}
              >
                https://app.example.com
              </div>
            </div>

            {/* Dashboard content */}
            <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Code editor header */}
              <div
                style={{
                  background: '#0F172A',
                  padding: 12,
                  borderRadius: 8,
                  opacity: textOpacity
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: 'white', marginBottom: 8 }}>
                  Technical Overview
                </div>
                <div style={{ fontSize: 9, color: '#94A3B8', fontFamily: 'monospace' }}>
                  {tweetData.text.substring(0, 50)}...
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'API Calls', value: Math.floor(frame / 10) },
                  { label: 'Latency', value: `${Math.floor(50 + Math.sin(frame / 20) * 20)}ms` },
                ].map((stat, i) => {
                  const statOpacity = interpolate(
                    frame,
                    [t.buttonDelay + i * 5, t.buttonDelay + i * 5 + 15],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  );

                  return (
                    <div
                      key={i}
                      style={{
                        background: '#0F172A',
                        padding: 10,
                        borderRadius: 6,
                        opacity: statOpacity,
                        border: `1px solid ${c.accent}`
                      }}
                    >
                      <div style={{ fontSize: 8, color: '#94A3B8', marginBottom: 4 }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: c.accent }}>
                        {stat.value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Terminal output */}
              <div
                style={{
                  background: '#0F172A',
                  padding: 10,
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  fontSize: 8,
                  color: '#10B981',
                  opacity: elementsOpacity
                }}
              >
                <div>$ npm run build</div>
                <div style={{ color: '#64748B' }}>Building for production...</div>
                <div style={{ color: '#10B981' }}>✓ Build complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop base */}
        <div
          style={{
            width: 500,
            height: 8,
            background: 'linear-gradient(to bottom, #1F2937, #111827)',
            borderRadius: '0 0 20px 20px',
            marginTop: -4,
            marginLeft: -25,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}
        />

        {/* Laptop label */}
        <div
          style={{
            marginTop: 12,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 600,
            color: c.primary,
            opacity: textOpacity
          }}
        >
          Web Dashboard
        </div>
      </div>

      {/* Center technical indicator */}
      <div
        style={{
          position: 'absolute',
          left: width / 2,
          top: 50,
          transform: 'translateX(-50%)',
          opacity: textOpacity
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '12px 24px',
            borderRadius: 12,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: `2px solid ${c.secondary}`
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: c.primary, textAlign: 'center' }}>
            Cross-Platform Integration
          </div>
          <div style={{ fontSize: 10, color: '#6B7280', textAlign: 'center', marginTop: 4 }}>
            Syncing data in real-time
          </div>
        </div>
      </div>

      {/* Bottom tech stack badges */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: width / 2,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          opacity: elementsOpacity
        }}
      >
        {['React', 'API', 'Cloud'].map((tech, i) => (
          <div
            key={i}
            style={{
              background: c.accent,
              color: 'white',
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
