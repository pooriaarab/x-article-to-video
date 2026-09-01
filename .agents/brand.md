# Brand

## Identity

X Article to Video turns an X post into a rendered motion-graphics video.
It combines a Chrome extension, a local Express server, and Remotion templates.
The server also uses the xAI API for generated composition data and images.

Sources: `extension/manifest.json`, `server.js`, and `src/Root.tsx`.

## Audience

- X users capture a post, select styles, preview results, and download videos.
- React developers add or change Remotion composition templates.

The product does not publish videos to X.

## Promise

Capture one X post and render it through one or more selectable video styles.
Keep capture, style selection, preview, settings, and download in one extension flow.

## Voice

- Use direct action labels: `Capture X Post`, `Generate Video`, and `Download`.
- Use short progress messages that explain the current render stage.
- Keep setup and API errors specific and actionable.
- Reserve playful language for progress messages, not privacy or reliability claims.
- Avoid claims such as instant, professional, private, or fully local.

## Names

- Use `X Article to Video` for the public product name.
- Use `X post` in public copy.
- Use `tweet` only where existing source identifiers require it.
- Write `Remotion`, `Chrome extension`, `xAI`, and `Grok` as shown.
- Keep the internal package name `tweet-to-remotion` inside `package.json`.

## Claims

- Registered compositions render at `1080 × 1080` and `30 fps`.
  See `src/Root.tsx`.
- Rendering runs through the local Express server. See `server.js`.
- The server sends post content and author data to xAI for AI generation.
  See the xAI requests in `server.js`.
- The extension downloads completed MP4 files. See `extension/popup.js`.

Do not claim that all data stays on the device.
Do not promise a fixed render time or output size without current measurements.

## Assets

Extension icons live in `extension/icons/`.
The manifest declares the 16, 48, and 128 pixel PNG files.
