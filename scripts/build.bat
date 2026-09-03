@echo off
REM Build script for Windows — builds all components per BA v1.4.
REM app/ là Flutter (không thuộc pnpm workspace), được build riêng.

echo ======================================
echo NEKOPATH Build Script (BA v1.4)
echo ======================================

REM ---- Kiểm tra điều kiện ----
where pnpm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: pnpm is required but not installed.
    exit /b 1
)

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is required but not installed.
    exit /b 1
)

where flutter >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: flutter is required but not installed (cho app\).
    exit /b 1
)

REM ---- Content pipeline (TypeScript) ----
echo.
echo Installing pnpm dependencies...
call pnpm install

echo.
echo Building content-pipeline...
call pnpm --filter @nekopath/content-pipeline build

echo.
echo Building review-console...
call pnpm --filter @nekopath/review-console build

REM ---- App Flutter ----
echo.
echo Building Flutter app (Android APK + Windows EXE)...
cd app
call flutter pub get

REM APK (TS-17)
echo Building Android APK...
call flutter build apk --release

REM Windows EXE (TS-18)
echo Building Windows EXE...
call flutter build windows --release

cd ..

echo.
echo ======================================
echo Build complete!
echo ======================================
echo.
echo Output:
echo   - Android APK: app\build\app\outputs\flutter-apk\app-release.apk
echo   - Windows EXE: app\build\windows\runner\Release\nekopath_app.exe
echo   - Content bundles: content-pipeline\dist\*.nekopath-bundle.zip
echo.
echo CANH BAO: Model + noi dung (vai tram MB - GB) phan phoi qua USB (TS-19/20).
echo           KHONG bundle model vao APK/EXE.
