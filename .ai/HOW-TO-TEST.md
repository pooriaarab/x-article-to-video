# How to Test the Extension - Quick Guide

## ✅ What's Already Done

I've completed all automated testing:

- ✅ Server is running on http://localhost:3000
- ✅ All API endpoints tested and working
- ✅ Code reviewed - no critical issues
- ✅ Fixed missing "downloads" permission
- ✅ Created comprehensive test documentation

## 🚀 How YOU Can Test It

### Step 1: Load the Extension (1 minute)

1. Open Chrome
2. Go to `chrome://extensions/`
3. Toggle "Developer mode" ON (top right)
4. Click "Load unpacked"
5. Select this folder: `extension` (the `extension` folder inside this repo)
6. You should see "Tweet to Video" extension appear

**Expected:** Blue icon appears in your toolbar

---

### Step 2: Configure It (30 seconds)

1. Click the extension icon in toolbar
2. Click ⚙️ (settings gear)
3. Paste your Grok API key (get from https://console.x.ai/)
4. Verify server URL shows: `http://localhost:3000`
5. Click "Save Settings"

**Expected:** Green "Settings saved" message

---

### Step 3: Test on a Real Tweet (2 minutes)

1. Go to https://x.com/remotion (or any Twitter/X account)
2. Scroll to any tweet
3. Click the extension icon
4. Click "📸 Capture Tweet"
5. Wait 1-2 seconds
6. Verify you see:
   - Tweet text
   - Author name and avatar
   - Three style buttons

**Expected:** Tweet data appears in preview

---

### Step 4: Generate Your First Video (30 seconds)

1. Select "✨ Minimal" style
2. Click "🎥 Generate Video"
3. Watch the progress bar
4. Wait 15-30 seconds
5. Video preview should appear
6. Click ▶️ to play it

**Expected:** Video renders and plays

---

### Step 5: Download It (10 seconds)

1. Click "⬇️ Download"
2. Choose where to save
3. Open the MP4 file
4. Verify it plays

**Expected:** MP4 file downloads and works

---

## 🎯 Quick Test Results

After testing, report back:

```
✅ Extension loaded successfully
✅ Settings saved
✅ Tweet captured
✅ Video generated
✅ Video downloaded
```

OR if something failed:

```
❌ Failed at: [which step]
Error: [what happened]
Console errors: [paste any errors]
```

---

## 🔧 If Something Breaks

### Extension won't load?
- Make sure you selected the `extension/` folder, not the root folder
- Check for errors in `chrome://extensions/`

### Can't capture tweet?
- Make sure you're on a tweet page, not the timeline
- Try a different tweet
- Check browser console (F12)

### Video won't generate?
- Verify server is running: `curl http://localhost:3000/api/health`
- Check if Grok API key is valid
- Look at server terminal for errors

### Download fails?
- Check Chrome downloads permission
- Try saving to different location

---

## 📊 Test Different Scenarios

Once basic test works, try:

1. **Text-only tweet** (simplest)
2. **Tweet with 1 image** (medium)
3. **Tweet with multiple images** (complex)
4. **Long tweet** (200+ chars)
5. **Short tweet** (<50 chars)

Try all 3 styles:
- ✨ Minimal (clean design)
- 💻 Terminal (retro)
- 🎬 Kinetic (dynamic)

---

## 📝 Full Documentation

- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **Full Testing:** [TESTING.md](TESTING.md)
- **Test Report:** [TEST-REPORT.md](TEST-REPORT.md)
- **Full README:** [README.md](README.md)

---

## ✨ That's It!

The extension is fully built and ready. Just load it in Chrome and test with a real tweet!

**Server Status:** ✅ Running
**Code Status:** ✅ Complete
**Docs Status:** ✅ Ready

**Need Help?** Check TESTING.md for detailed troubleshooting.
