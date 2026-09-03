#!/bin/bash
# Deploy script — BA v1.4.
# NEKOPATH không deploy qua cloud — phân phối qua USB (TS-19).
# Script này hỗ trợ:
#   1. Build app Flutter (Android APK / Windows EXE).
#   2. Build + ký gói nội dung.
#   3. Copy output ra thư mục deploy/ để chép sang USB.

set -e

ENVIRONMENT=${1:-staging}
DEPLOY_DIR=${2:-./deploy}

echo "======================================"
echo "NEKOPATH Deploy Script (BA v1.4)"
echo "Environment: $ENVIRONMENT"
echo "Deploy dir: $DEPLOY_DIR"
echo "======================================"

# ---- Kiểm tra môi trường ----
case $ENVIRONMENT in
    staging|production)
        echo "Deploying to $ENVIRONMENT..."
        ;;
    *)
        echo "Error: Unknown environment '$ENVIRONMENT'"
        echo "Valid: staging | production"
        exit 1
        ;;
esac

mkdir -p "$DEPLOY_DIR"

# ---- 1. Build app Flutter ----
echo ""
echo "Building Flutter app..."
cd app
flutter pub get
flutter build apk --release
case "$(uname -s)" in
    MINGW*|CYGWIN*|MSYS*)
        flutter build windows --release
        ;;
esac
cd ..

# Copy app artifacts
mkdir -p "$DEPLOY_DIR/app"
if [ -f "app/build/app/outputs/flutter-apk/app-release.apk" ]; then
    cp "app/build/app/outputs/flutter-apk/app-release.apk" "$DEPLOY_DIR/app/"
fi
if [ -f "app/build/windows/runner/Release/nekopath_app.exe" ]; then
    cp "app/build/windows/runner/Release/nekopath_app.exe" "$DEPLOY_DIR/app/"
fi

# ---- 2. Build + ký bundle nội dung ----
echo ""
echo "Building & signing content bundle..."
./scripts/build-bundle.sh "$DEPLOY_DIR/content" "$(date +%Y.%m.%d)"

# ---- 3. Tóm tắt ----
echo ""
echo "======================================"
echo "Deploy artifacts ready in $DEPLOY_DIR"
echo "======================================"
echo ""
ls -la "$DEPLOY_DIR"
echo ""
echo "Copy $DEPLOY_DIR sang USB để cài đặt cho thiết bị offline."
echo "⚠️  KHÔNG phân phối qua cloud — phải qua USB (TS-19)."
