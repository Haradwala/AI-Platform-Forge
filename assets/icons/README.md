# Application Icons

Place your app icon files here:

| File | Size | Platform |
|------|------|----------|
| `icon.png` | 512×512 | Linux, fallback |
| `icon@2x.png` | 1024×1024 | Retina |
| `icon.ico` | Multi-size ICO | Windows |
| `icon.icns` | ICNS bundle | macOS |

Icons are referenced by `electron-builder.yml` and are NOT bundled by Vite.

## Generating Icons

Given a master `icon.png` (1024×1024):

```bash
# Install icon generation tool
npm install -g electron-icon-builder

# Generate all formats
electron-icon-builder --input=icon.png --output=./
```
