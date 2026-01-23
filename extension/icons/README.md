# Extension Icons

For now, use online tools to convert `icon.svg` to PNG at these sizes:
- icon16.png (16x16)
- icon48.png (48x48)
- icon128.png (128x128)

Or use this command if you have ImageMagick:
```bash
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png
```

Temporary placeholder: You can also just copy the SVG 3 times and rename them to .png for testing (Chrome will handle it).
