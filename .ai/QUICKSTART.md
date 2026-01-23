# Quick Start Guide

Get up and running in 5 minutes!

## 1. Install Dependencies (30 seconds)

```bash
npm install
```

## 2. Get Grok API Key (2 minutes)

Visit [console.x.ai](https://console.x.ai/) and create an API key.

## 3. Load Extension (1 minute)

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder

## 4. Configure Extension (30 seconds)

1. Click extension icon
2. Click ⚙️ (settings)
3. Enter your Grok API key
4. Save

## 5. Start Server (10 seconds)

```bash
npm run server
```

## 6. Test It! (1 minute)

1. Go to any tweet on Twitter/X
2. Click extension icon
3. Click "📸 Capture Tweet"
4. Select a style
5. Click "🎥 Generate Video"
6. Wait for video to render
7. Download!

## That's it! 🎉

Now you can turn any tweet into a video in seconds.

### Common Commands

```bash
# Start the API server
npm run server

# Preview compositions in Remotion Studio
npm start

# Render a specific composition
npm run build
```

### Keyboard Shortcuts

- Click extension icon: `Alt+Shift+T` (customizable in chrome://extensions/shortcuts)

### Quick Tips

- **Faster renders**: Choose "Minimal" style
- **Best quality**: Use tweets with high-res images
- **Retry failed renders**: Click "🔄 New Video" and try again
- **Multiple videos**: Restart after each video (KISS!)

Need more help? Check the full [README.md](README.md)
