#!/bin/bash

echo "=========================================="
echo "  🔄 Complete Reset & Restart Script"
echo "=========================================="
echo ""

# Stop any running servers
echo "1️⃣  Stopping any running servers..."
pkill -f "node.*server" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2
echo "   ✓ Servers stopped"
echo ""

# Clear all caches
echo "2️⃣  Clearing all caches..."
rm -rf .remotion 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf remotion-cache 2>/dev/null || true
rm -rf /tmp/remotion-* 2>/dev/null || true
echo "   ✓ Remotion caches cleared"
echo ""

# Clear generated videos
echo "3️⃣  Clearing generated videos..."
rm -rf out/*.mp4 2>/dev/null || true
echo "   ✓ Videos cleared"
echo ""

# Verify no hardcoded durations
echo "4️⃣  Verifying composition setup..."
if grep -q "durationInFrames={[0-9]" src/Root.tsx; then
  echo "   ✗ ERROR: Found hardcoded durationInFrames in Root.tsx"
  grep -n "durationInFrames={[0-9]" src/Root.tsx
  exit 1
else
  echo "   ✓ No hardcoded durations found"
fi
echo ""

# Count compositions
COMP_COUNT=$(grep -c "id=\"Tweet" src/Root.tsx)
echo "5️⃣  Found $COMP_COUNT compositions registered"
echo ""

echo "=========================================="
echo "  🚀 Starting Server with Debug Logs"
echo "=========================================="
echo ""
echo "📝 Watch for these logs when generating:"
echo "   • 🎬 Received generation request"
echo "   • Style: TweetXXX"
echo "   • Duration: X seconds"
echo "   • 📹 Selecting composition"
echo "   • 🎨 TweetXXX rendering with props"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "=========================================="
echo ""

# Start server
npm run server
