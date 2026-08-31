import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const rootDir = "/Users/lordjef/Desktop/abraxasos";
const tauriDir = path.join(rootDir, "VAV/01_REPO/VAV/apps/captions-desktop/src-tauri");
const binarySrc = path.join(tauriDir, "target/debug/abraxas-os");
const iconSrc = path.join(tauriDir, "icons/icon.icns");
const distDir = path.join(rootDir, "dist/installers");
const appBundleDir = path.join(distDir, "ABRAXAS OS.app");
const dmgPath = path.join(distDir, "ABRAXAS_OS.dmg");

console.log("[macOS Packager] Creating release bundle directories...");
fs.mkdirSync(distDir, { recursive: true });
fs.rmSync(appBundleDir, { recursive: true, force: true });

const macosDir = path.join(appBundleDir, "Contents/MacOS");
const resourcesDir = path.join(appBundleDir, "Contents/Resources");
fs.mkdirSync(macosDir, { recursive: true });
fs.mkdirSync(resourcesDir, { recursive: true });

console.log("[macOS Packager] Copying native Rust binary and icon...");
if (fs.existsSync(binarySrc)) {
  fs.copyFileSync(binarySrc, path.join(macosDir, "abraxas-os"));
  fs.chmodSync(path.join(macosDir, "abraxas-os"), 0o755);
} else {
  console.warn(`Binary not found at ${binarySrc}, build cargo first.`);
}

if (fs.existsSync(iconSrc)) {
  fs.copyFileSync(iconSrc, path.join(resourcesDir, "icon.icns"));
}

const infoPlistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>abraxas-os</string>
    <key>CFBundleIconFile</key>
    <string>icon.icns</string>
    <key>CFBundleIdentifier</key>
    <string>com.abraxas.os</string>
    <key>CFBundleName</key>
    <string>ABRAXAS OS</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>10.0.0</string>
    <key>CFBundleVersion</key>
    <string>10.0.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>11.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
`;

fs.writeFileSync(path.join(appBundleDir, "Contents/Info.plist"), infoPlistContent);

console.log("[macOS Packager] Creating macOS DMG image via hdiutil...");
try {
  fs.rmSync(dmgPath, { force: true });
  execSync(`hdiutil create -volname "ABRAXAS OS" -srcfolder "${appBundleDir}" -ov -format UDZO "${dmgPath}"`, { stdio: "inherit" });
  console.log(`[macOS Packager] Successfully generated: ${dmgPath}`);
} catch (e) {
  console.warn("[macOS Packager] hdiutil packaging note:", e.message);
}

console.log("[macOS Packager] ABRAXAS OS.app & ABRAXAS_OS.dmg packaging complete.");
