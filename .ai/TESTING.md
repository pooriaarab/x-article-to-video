# Manual Testing Guide

## Automated Tests ✅

The following were tested automatically:

- ✅ Server health check endpoint
- ✅ Generate video endpoint
- ✅ Status polling endpoint
- ✅ Extension manifest structure
- ✅ Code review completed

## Manual Testing Checklist

Follow these steps to fully test the extension:

### 1. Extension Installation (2 minutes)

- [ ] Open Chrome
- [ ] Go to `chrome://extensions/`
- [ ] Enable "Developer mode" (top right)
- [ ] Click "Load unpacked"
- [ ] Select the `extension/` folder
- [ ] Verify extension appears with icon
- [ ] No errors in console

**Expected:** Extension loads successfully with blue icon

---

### 2. Extension Settings (1 minute)

- [ ] Click extension icon in toolbar
- [ ] Click ⚙️ settings button
- [ ] Enter Grok API key (get from https://console.x.ai/)
- [ ] Verify "http://localhost:3000" in server URL field
- [ ] Click "Save Settings"
- [ ] See green "Settings saved successfully" message

**Expected:** Settings save without errors

---

### 3. Tweet Capture - Simple Text Tweet (3 minutes)

- [ ] Go to https://x.com/remotion
- [ ] Scroll to any text-only tweet
- [ ] Click extension icon
- [ ] Click "📸 Capture Tweet"
- [ ] Wait 1-2 seconds
- [ ] Verify tweet preview shows:
  - [ ] Author avatar
  - [ ] Author name
  - [ ] Author username
  - [ ] Tweet text
- [ ] Verify three style buttons appear (Minimal, Terminal, Kinetic)
- [ ] Click each style to test selection
- [ ] Verify active style has blue border

**Expected:** Tweet data captured and displayed correctly

---

### 4. Tweet Capture - Tweet with Image (3 minutes)

- [ ] Find a tweet with an image on X
- [ ] Click extension icon
- [ ] Click "📸 Capture Tweet"
- [ ] Verify preview shows:
  - [ ] Tweet text
  - [ ] Author info
  - [ ] Image thumbnail(s)

**Expected:** Images appear in preview

---

### 5. Video Generation - Minimal Style (30 seconds)

- [ ] After capturing tweet, select "Minimal" style
- [ ] Click "🎥 Generate Video"
- [ ] Verify progress bar appears
- [ ] Watch progress messages:
  - "Connecting to Remotion server..."
  - "Generating composition with Grok..."
  - "Rendering video..."
  - Progress percentage increases
- [ ] Wait for completion (10-30 seconds)
- [ ] Verify video player appears
- [ ] Click play on video
- [ ] Verify video shows:
  - [ ] Tweet content
  - [ ] Smooth animations
  - [ ] No visual glitches

**Expected:** Video renders successfully and plays

---

### 6. Video Generation - Terminal Style (30 seconds)

- [ ] Click "🔄 New Video"
- [ ] Capture another tweet
- [ ] Select "Terminal" style
- [ ] Click "Generate Video"
- [ ] Wait for completion
- [ ] Verify terminal-style video:
  - [ ] Black background
  - [ ] Green text
  - [ ] Typewriter effect
  - [ ] Terminal window design

**Expected:** Terminal style renders correctly

---

### 7. Video Generation - Kinetic Style (30 seconds)

- [ ] Click "🔄 New Video"
- [ ] Capture another tweet
- [ ] Select "Kinetic" style
- [ ] Click "Generate Video"
- [ ] Wait for completion
- [ ] Verify kinetic video:
  - [ ] Words animate individually
  - [ ] Colorful design
  - [ ] Dynamic motion
  - [ ] Bold typography

**Expected:** Kinetic style renders correctly

---

### 8. Video Download (30 seconds)

- [ ] After video renders, click "⬇️ Download"
- [ ] Choose save location (or use default Downloads)
- [ ] Click Save
- [ ] Open Downloads folder
- [ ] Verify MP4 file exists
- [ ] Open video in media player
- [ ] Verify video plays correctly

**Expected:** Video downloads as MP4 and plays

---

### 9. Error Handling (2 minutes)

#### Test 1: No API Key
- [ ] Go to settings
- [ ] Clear API key field
- [ ] Save settings
- [ ] Try to generate video
- [ ] Verify error: "Please set your Grok API key in settings"

**Expected:** Clear error message

#### Test 2: Wrong Page
- [ ] Go to https://google.com
- [ ] Click extension icon
- [ ] Click "Capture Tweet"
- [ ] Verify error: "Please navigate to a tweet on Twitter/X"

**Expected:** Clear error message

#### Test 3: Server Not Running
- [ ] Stop server (Ctrl+C in server terminal)
- [ ] Try to generate video
- [ ] Verify error about server connection

**Expected:** Network error shown

---

### 10. Performance Testing (2 minutes)

Test with different tweet types:

- [ ] Short tweet (< 50 chars) → Fast render
- [ ] Long tweet (> 200 chars) → Still works
- [ ] Tweet with 1 image → Renders image
- [ ] Tweet with multiple images → Shows all images
- [ ] Tweet with video → Shows video thumbnail

**Expected:** All tweet types work

---

### 11. Multiple Videos (2 minutes)

- [ ] Generate first video
- [ ] Download it
- [ ] Click "New Video"
- [ ] Capture different tweet
- [ ] Generate second video
- [ ] Download it
- [ ] Verify both videos are different
- [ ] Both play correctly

**Expected:** Can create multiple videos sequentially

---

### 12. UI/UX Testing (2 minutes)

- [ ] Verify extension popup is 400px wide
- [ ] All text is readable
- [ ] Buttons have hover effects
- [ ] Colors match design (blue accent, clean white)
- [ ] No layout breaking on small text
- [ ] No layout breaking on long tweet
- [ ] Icons display correctly (emojis)
- [ ] Video player controls work

**Expected:** Professional, clean UI

---

## Troubleshooting Tests

### If Tweet Capture Fails:

1. Check console errors:
   - Right-click extension → Inspect popup
   - Check Console tab
   - Look for JavaScript errors

2. Check content script:
   - Go to tweet page
   - F12 → Console tab
   - Look for content script errors

### If Video Generation Fails:

1. Check server logs:
   - Look at terminal running `npm run server`
   - Check for errors

2. Test API directly:
   ```bash
   node test-api.js
   ```

3. Check Grok API:
   - Verify API key is valid
   - Check API credits

### If Download Fails:

1. Check Chrome permissions:
   - Go to `chrome://extensions/`
   - Click extension details
   - Verify "Downloads" permission is granted

2. Check disk space:
   - Ensure enough space for video file

---

## Performance Benchmarks

Expected timings:

| Operation | Time | Notes |
|-----------|------|-------|
| Tweet capture | < 2s | Instant on fast connection |
| Video generation (Minimal) | 15-20s | Depends on tweet length |
| Video generation (Terminal) | 20-25s | Typewriter takes time |
| Video generation (Kinetic) | 15-20s | Word animations |
| Video download | < 1s | Local file |

---

## Known Limitations

- Can only capture one tweet at a time
- Requires local server running
- Videos limited to 1080x1080px
- No background music support
- No video editing features
- Requires Grok API credits

---

## Success Criteria

Extension passes if:

- ✅ All 12 test sections pass
- ✅ No JavaScript errors in console
- ✅ Videos render correctly for all 3 styles
- ✅ Downloads work reliably
- ✅ Error messages are clear
- ✅ UI is responsive and clean

---

## Bug Report Template

If you find issues, report them with:

```
**Bug:** Brief description

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. ...

**Expected:** What should happen

**Actual:** What actually happened

**Console Errors:** (Paste any errors)

**Screenshots:** (If applicable)

**Environment:**
- Chrome version:
- Extension version: 1.0.0
- Server running: Yes/No
```

---

## Test Results

Date: _______________
Tester: _______________

| Test Section | Pass/Fail | Notes |
|--------------|-----------|-------|
| 1. Installation | ⬜ | |
| 2. Settings | ⬜ | |
| 3. Text Tweet Capture | ⬜ | |
| 4. Image Tweet Capture | ⬜ | |
| 5. Minimal Style | ⬜ | |
| 6. Terminal Style | ⬜ | |
| 7. Kinetic Style | ⬜ | |
| 8. Download | ⬜ | |
| 9. Error Handling | ⬜ | |
| 10. Performance | ⬜ | |
| 11. Multiple Videos | ⬜ | |
| 12. UI/UX | ⬜ | |

**Overall Status:** ⬜ Pass / ⬜ Fail

**Notes:**
