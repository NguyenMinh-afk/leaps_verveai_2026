#!/bin/bash
# Content bundle builder — BA v1.4, TS-19.
# Tạo bundle nội dung (.nekopath-bundle.zip) để cài qua USB.
# Bundle phải được ký Ed25519 (xem content-pipeline/src/export/signBundle.ts) trước khi phát hành.

set -e

OUTPUT_DIR=${1:-./dist/bundles}
VERSION=${2:-$(date +%Y.%m.%d)}
CONTENT_DIR=${3:-./content}

echo "======================================"
echo "Content Bundle Builder (BA v1.4 — TS-19)"
echo "Version: $VERSION"
echo "Output: $OUTPUT_DIR"
echo "======================================"

mkdir -p "$OUTPUT_DIR"

# Kiểm tra file nội dung tồn tại
if [ ! -f "$CONTENT_DIR/knowledge-graph.json" ]; then
    echo "Warning: $CONTENT_DIR/knowledge-graph.json not found"
    mkdir -p "$CONTENT_DIR"
    echo '{"version": "'$VERSION'", "nodes": [], "edges": []}' > "$CONTENT_DIR/knowledge-graph.json"
fi

if [ ! -f "$CONTENT_DIR/item-bank.json" ]; then
    echo "Warning: $CONTENT_DIR/item-bank.json not found"
    echo '{"version": "'$VERSION'", "items": []}' > "$CONTENT_DIR/item-bank.json"
fi

# 1) Đóng gói qua content-pipeline
echo ""
echo "Building bundle with content-pipeline..."
node -e "
const { buildContentBundle } = require('./content-pipeline/dist/export/buildContentBundle');
buildContentBundle({
    outputDir: '$OUTPUT_DIR',
    version: '$VERSION',
    contentVersion: '$VERSION',
    knowledgeGraphPath: '$CONTENT_DIR/knowledge-graph.json',
    itemBankPath: '$CONTENT_DIR/item-bank.json',
}).then(result => {
    if (result.success) {
        console.log('Bundle created:', result.bundlePath);
        process.exit(0);
    } else {
        console.error('Failed:', result.errors);
        process.exit(1);
    }
});
"

# 2) Ký Ed25519 (TS-19/20)
# Khoá riêng lấy từ PRIVATE_KEY_PATH env; KHÔNG commit khoá.
PRIVATE_KEY_PATH=${PRIVATE_KEY_PATH:-./keys/content-signing.key}
if [ ! -f "$PRIVATE_KEY_PATH" ]; then
    echo "Error: Private key không tìm thấy ở $PRIVATE_KEY_PATH"
    echo "Đặt PRIVATE_KEY_PATH trỏ tới khoá Ed25519 của người thẩm định."
    exit 1
fi

echo ""
echo "Signing bundle with Ed25519..."
node -e "
const { signBundle } = require('./content-pipeline/dist/export/signBundle');
const fs = require('fs');
const bundlePath = '$OUTPUT_DIR/nekopath-content-v$VERSION.zip';
signBundle({
    bundlePath,
    privateKeyPath: '$PRIVATE_KEY_PATH',
}).then(result => {
    if (result.success) {
        console.log('Signed bundle:', result.signedPath);
        process.exit(0);
    } else {
        console.error('Sign failed:', result.errors);
        process.exit(1);
    }
});
"

echo ""
echo "======================================"
echo "Bundle built & signed!"
echo "======================================"
echo ""
echo "⚠️  Copy '$OUTPUT_DIR/nekopath-content-v$VERSION.zip' sang USB."
echo "    App sẽ xác minh chữ ký qua content_security/signature_verify.dart."
