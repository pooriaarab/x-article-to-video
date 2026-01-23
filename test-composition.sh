#!/bin/bash

echo "=== Testing Composition Setup ==="
echo ""

# Kill any existing server
pkill -f "node.*server.js"
sleep 2

# Clear all caches
echo "1. Clearing caches..."
rm -rf .remotion
rm -rf node_modules/.cache
rm -rf out/*.mp4
echo "   ✓ Caches cleared"
echo ""

# Check if compositions have correct props
echo "2. Checking composition definitions..."
grep -n "durationInFrames=" src/Root.tsx && echo "   ✗ ERROR: Found hardcoded durationInFrames" || echo "   ✓ No hardcoded durations"
echo ""

# Start server with debug output
echo "3. Starting server with debug logging..."
echo "   Watch for these logs when you generate:"
echo "   - '🎬 Received generation request'"
echo "   - 'Style: TweetXXX'"
echo "   - 'Duration: X seconds'"
echo ""
npm run server
