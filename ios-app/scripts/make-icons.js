'use strict';
/* Icône et splash à partir de l'icône bleue officielle (#0066FF). */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
fs.mkdirSync(path.join(__dirname, '../resources'), { recursive: true });
const script = `
from PIL import Image
icon = Image.open(${JSON.stringify(path.join(__dirname, '../../app/icons/icon-512.png'))}).convert('RGBA')
icon.resize((1024, 1024), Image.Resampling.LANCZOS).save(${JSON.stringify(path.join(__dirname, '../resources/icon-1024.png'))})
splash = Image.new('RGB', (2732, 2732), (0, 102, 255))
mark = icon.resize((900, 900), Image.Resampling.LANCZOS)
splash.paste(mark, ((2732 - 900) // 2, (2732 - 900) // 2), mark)
splash.save(${JSON.stringify(path.join(__dirname, '../resources/splash-2732.png'))})
print('icons ok')
`;
execFileSync('python3', ['-c', script], { stdio: 'inherit' });

const icon = path.join(__dirname, '../resources/icon-1024.png');
const splash = path.join(__dirname, '../resources/splash-2732.png');
const iconSet = path.join(__dirname, '../ios/App/App/Assets.xcassets/AppIcon.appiconset');
const splashSet = path.join(__dirname, '../ios/App/App/Assets.xcassets/Splash.imageset');
if (fs.existsSync(iconSet)) fs.copyFileSync(icon, path.join(iconSet, 'AppIcon-512@2x.png'));
if (fs.existsSync(splashSet)) {
  for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
    fs.copyFileSync(splash, path.join(splashSet, name));
  }
}
