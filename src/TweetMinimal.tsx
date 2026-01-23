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
  svgIcon?: string;
  colors?: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
  timing?: {
    textDelay: number;
    imageDelay: number;
    avatarDelay: number;
  };
}

export const TweetMinimal: React.FC<Props> = ({ tweetData, durationInFrames, aiImages, svgIcon, colors, timing }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: configDuration } = useVideoConfig();

  // Debug logging (only on first frame)
  if (frame === 0) {
    console.log('🎨 TweetMinimal rendering with props:', {
      durationProp: durationInFrames,
      configDuration: configDuration,
      hasAiImages: !!aiImages,
      aiImagesCount: aiImages?.length || 0,
      hasSvgIcon: !!svgIcon,
      hasCustomColors: !!colors,
      hasCustomTiming: !!timing
    });
  }

  // Default values
  const c = colors || {
    primary: '#0F172A',
    secondary: '#64748B',
    background: '#FFFFFF',
    accent: '#0084FF'
  };

  const t = timing || {
    textDelay: 10,
    imageDelay: 40,
    avatarDelay: 0
  };

  // Animations
  const avatarOpacity = interpolate(
    frame,
    [t.avatarDelay, t.avatarDelay + 20],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const avatarScale = interpolate(
    frame,
    [t.avatarDelay, t.avatarDelay + 20],
    [0.8, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const textOpacity = interpolate(
    frame,
    [t.textDelay, t.textDelay + 30],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const textY = interpolate(
    frame,
    [t.textDelay, t.textDelay + 30],
    [20, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const mediaOpacity = interpolate(
    frame,
    [t.imageDelay, t.imageDelay + 20],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  // SVG icon animation
  const svgOpacity = interpolate(
    frame,
    [5, 25],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const svgScale = interpolate(
    frame,
    [5, 25],
    [0.5, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const svgRotate = interpolate(
    frame,
    [5, 25],
    [-10, 0],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill
      style={{
        background: c.background,
        padding: 60,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: '100%',
          background: 'white',
          borderRadius: 20,
          padding: 40,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Author section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
            opacity: avatarOpacity,
            transform: `scale(${avatarScale})`
          }}
        >
          {tweetData.author.profilePicUrl && (
            <Img
              src={tweetData.author.profilePicUrl}
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          )}
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: c.primary,
                fontFamily: 'sans-serif'
              }}
            >
              {tweetData.author.name}
            </div>
            <div
              style={{
                fontSize: 16,
                color: c.secondary,
                fontFamily: 'sans-serif'
              }}
            >
              {tweetData.author.username}
            </div>
          </div>
        </div>

        {/* SVG Icon */}
        {svgIcon && svgIcon.startsWith('<svg') && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 24,
              opacity: svgOpacity,
              transform: `scale(${svgScale}) rotate(${svgRotate}deg)`,
              maxWidth: 100,
              maxHeight: 100
            }}
            dangerouslySetInnerHTML={{ __html: svgIcon }}
          />
        )}

        {/* Tweet text */}
        <div
          style={{
            fontSize: 24,
            lineHeight: 1.6,
            color: c.primary,
            marginBottom: tweetData.media && tweetData.media.length > 0 ? 24 : 0,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            fontFamily: 'sans-serif',
            whiteSpace: 'pre-wrap'
          }}
        >
          {tweetData.text}
        </div>

        {/* Media */}
        {tweetData.media && tweetData.media.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: tweetData.media.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              gap: 12,
              opacity: mediaOpacity
            }}
          >
            {tweetData.media.map((item, index) => (
              <Img
                key={index}
                src={item.url}
                style={{
                  width: '100%',
                  height: tweetData.media!.length === 1 ? 300 : 200,
                  objectFit: 'cover',
                  borderRadius: 12
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accent decoration */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          height: 4,
          background: c.accent,
          opacity: 0.3,
          transform: `scaleX(${interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })})`
        }}
      />
    </AbsoluteFill>
  );
};
