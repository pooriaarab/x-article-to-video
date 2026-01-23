# X Article to Video

Transform your X (Twitter) posts into stunning motion graphics videos with AI-powered composition generation.

## Overview

X Article to Video is a Chrome extension that captures tweets and converts them into professional video content using Remotion and the Grok AI API. Choose from multiple video styles, preview in real-time, and download instantly.

---

**Sponsored by [Postful.ai](https://postful.ai)** - The AI-powered social media management platform that helps you create, schedule, and optimize content across all platforms.

---

## Features

- **One-Click Capture** - Extract tweet content directly from X/Twitter
- **Multiple Video Styles** - Choose from Minimal, Terminal, or Kinetic typography designs
- **AI-Powered** - Grok AI generates optimized video compositions
- **Professional Animations** - Built with Remotion for smooth, high-quality output
- **Local Processing** - Your data stays on your machine
- **Instant Preview** - See your video before downloading

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Chrome browser
- Grok API key ([Get one here](https://console.x.ai/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pooriaarab/x-article-to-video.git
cd x-article-to-video
```

2. Install dependencies:
```bash
npm install
```

3. Start the local server:
```bash
npm run server
```

4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/` folder

5. Configure your Grok API key:
   - Click the extension icon
   - Open settings (⚙️)
   - Enter your API key
   - Save

## Usage

1. **Navigate** to any tweet on X/Twitter
2. **Click** the extension icon in your toolbar
3. **Capture** the tweet with one click
4. **Select** your preferred video style:
   - ✨ **Minimal** - Clean, modern card design
   - 💻 **Terminal** - Retro computing aesthetic with typewriter effects
   - 🎬 **Kinetic** - Dynamic typography with bold animations
5. **Generate** the video (takes 15-30 seconds)
6. **Preview** and download your video

## Project Structure

```
x-article-to-video/
├── extension/          # Chrome extension source
│   ├── manifest.json   # Extension configuration
│   ├── popup.html      # Main UI
│   ├── popup.js        # Extension logic
│   ├── content.js      # Tweet extraction
│   └── background.js   # Service worker
├── src/                # Remotion video compositions
│   ├── TweetMinimal.tsx
│   ├── TweetTerminal.tsx
│   └── TweetKinetic.tsx
└── server.js           # Local API server
```

## Video Styles

### Minimal
Professional card-based design with smooth fade-in animations. Perfect for business and professional content.

### Terminal
Retro terminal interface with typewriter effects and a classic green-on-black color scheme. Great for technical or nostalgic content.

### Kinetic
High-energy dynamic typography with animated backgrounds. Ideal for impactful quotes and announcements.

## Development

### Preview Compositions

Launch Remotion Studio to preview and edit video compositions:

```bash
npm start
```

### Customize Styles

Edit the composition files in `src/`:
- `TweetMinimal.tsx` - Minimal style
- `TweetTerminal.tsx` - Terminal style
- `TweetKinetic.tsx` - Kinetic style

### Add New Styles

1. Create a new composition file: `src/TweetYourStyle.tsx`
2. Register it in `src/Root.tsx`
3. Add the style option in `extension/popup.html`
4. Update `server.js` to handle the new style

## Tech Stack

- **Frontend**: Chrome Extension (Manifest V3), Vanilla JavaScript
- **Video Engine**: [Remotion](https://remotion.dev) - React-based video framework
- **AI**: [Grok API](https://x.ai) - Advanced language model for composition generation
- **Backend**: Express.js - Local API server
- **Runtime**: Node.js 18+

## Performance

- **Render Time**: 15-30 seconds per video
- **Output Quality**: 1080x1080 @ 30fps
- **File Size**: 500KB - 2MB
- **Local Processing**: No cloud upload required

## Troubleshooting

### Extension won't load
Ensure you selected the `extension/` folder, not the root project folder.

### Can't capture tweets
Make sure you're on an individual tweet page, not the timeline.

### Server connection errors
Verify the server is running on `http://localhost:3000` and the URL is correctly set in extension settings.

### Video render fails
Check server logs for errors. Restart the server if needed. Ensure your Grok API key is valid and has credits.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Roadmap

- [ ] Additional video styles
- [ ] Custom color schemes
- [ ] Multiple aspect ratios (16:9, 9:16, 4:5)
- [ ] Background music support
- [ ] Text overlay customization
- [ ] Batch processing
- [ ] Cloud rendering option
- [ ] Firefox extension support

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Remotion](https://remotion.dev)
- Powered by [Grok AI](https://x.ai)
- Inspired by modern motion graphics design
- Sponsored by [Postful.ai](https://postful.ai)

## Support

If you encounter issues or have questions:
- Check the [Troubleshooting](#troubleshooting) section
- Open an issue on GitHub
- Review the documentation in the `.ai/` folder

---

**Made with ❤️ for the X community**
