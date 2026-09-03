#!/bin/bash
# Build script — builds all components per BA v1.4.
# app/ là Flutter (không thuộc pnpm workspace), được build riêng.

set -e

echo "======================================"
echo "NEKOPATH Build Script (BA v1.4)"
echo "======================================"

# ---- Kiểm tra điều kiện ----
command -v pnpm >/dev/null 2>&1 || {
    echo "Error: pnpm is required but not installed."
    exit 1
}

command -v node >/dev/null 2>&1 || {
    echo "Error: Node.js is required but not installed."
    exit 1
}

command -v flutter >/dev/null 2>&1 || {
    echo "Error: flutter is required but not installed (cho app/)."
    exit 1
}

# ---- Content pipeline (TypeScript) ----
echo ""
echo "Installing pnpm dependencies..."
pnpm install

echo ""
echo "Building content-pipeline..."
pnpm --filter @nekopath/content-pipeline build

echo ""
echo "Building review-console..."
pnpm --filter @nekopath/review-console build

# ---- App Flutter ----
echo ""
echo "Building Flutter app (Android APK + Windows EXE)..."
cd app
flutter pub get

# APK (TS-17)
echo "Building Android APK..."
flutter build apk --release

# Windows EXE (TS-18) — chỉ chạy trên máy Windows
case "$(uname -s)" in
    MINGW*|CYGWIN*|MSYS*)
        echo "Building Windows EXE..."
        flutter build windows --release
        ;;
    *)
        echo "Skipping Windows build (chỉ chạy trên Windows)."
        ;;
esac

cd ..

echo ""
echo "======================================"
echo "Build complete!"
echo "======================================"
echo ""
echo "Output:"
echo "  - Android APK: app/build/app/outputs/flutter-apk/app-release.apk"
echo "  - Windows EXE: app/build/windows/runner/Release/nekopath_app.exe"
echo "  - Content bundles: content-pipeline/dist/*.nekopath-bundle.zip"
echo ""
echo "⚠️  Model + nội dung (vài trăm MB–GB) phân phối qua USB (TS-19/20)."
echo "    KHÔNG bundle model vào APK/EXE."
