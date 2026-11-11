import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function createPng(width, height, pixelFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon drawing function
// Maskable icons require safe zone in center 80%
function renderMonuIcon(x, y, w, h, isMaskable = false) {
  const u = x / w;
  const v = y / h;

  // Background gradient: Deep Indigo to Violet
  // (u, v) diagonal
  let bgR = Math.round(30 + 35 * u + 10 * v);
  let bgG = Math.round(27 + 29 * (1 - v));
  let bgB = Math.round(75 + 130 * v);

  // Rounded rectangle bounds for non-maskable, full bleed for maskable
  let inside = true;
  if (!isMaskable) {
    const rx = 0.18; // corner radius
    const cx = Math.min(Math.max(u, rx), 1 - rx);
    const cy = Math.min(Math.max(v, rx), 1 - rx);
    const dist = Math.hypot(u - cx, v - cy);
    if (dist > rx) {
      inside = false;
    }
  }

  if (!inside) {
    return [0, 0, 0, 0];
  }

  // Draw Icon in Safe Zone:
  // Center is (0.5, 0.5)
  // Computer screen + document scanner lines
  const scale = isMaskable ? 0.65 : 0.76;
  const nx = (u - 0.5) / scale + 0.5;
  const ny = (v - 0.5) / scale + 0.5;

  let r = bgR;
  let g = bgG;
  let b = bgB;
  let a = 255;

  // Outer ambient glow in the center
  const centerDist = Math.hypot(nx - 0.5, ny - 0.5);
  if (centerDist < 0.45) {
    const glow = (1 - centerDist / 0.45) * 45;
    r = Math.min(255, r + glow * 0.4);
    g = Math.min(255, g + glow * 0.8);
    b = Math.min(255, b + glow * 1.5);
  }

  // Draw Computer Monitor / Display Frame
  // Screen bounds: nx from 0.22 to 0.78, ny from 0.20 to 0.64
  if (nx >= 0.22 && nx <= 0.78 && ny >= 0.20 && ny <= 0.64) {
    const isBorder = (nx <= 0.26 || nx >= 0.74 || ny <= 0.24 || ny >= 0.60);
    if (isBorder) {
      // Sleek cyan border
      r = 31; g = 209; b = 249; // #1fd1f9
    } else {
      // Screen background (dark tech blue)
      r = 15; g = 23; b = 42; // #0f172a

      // Inside screen: Document sheet icon
      // Document bounds: nx from 0.35 to 0.65, ny from 0.28 to 0.56
      if (nx >= 0.35 && nx <= 0.65 && ny >= 0.28 && ny <= 0.56) {
        // Document with folded corner at top-right
        const isFold = (nx > 0.57 && ny < 0.36 && (nx - 0.57) + (0.36 - ny) > 0.10);
        if (!isFold) {
          // Document paper body: pure white or bright gradient
          r = 248; g = 250; b = 252;

          // Scanning laser line in emerald across middle of doc
          if (ny >= 0.41 && ny <= 0.44) {
            r = 16; g = 185; b = 129; // emerald green scan line #10b981
          } else if (ny >= 0.34 && ny <= 0.36 && nx >= 0.39 && nx <= 0.54) {
            // Text line 1
            r = 148; g = 163; b = 184;
          } else if (ny >= 0.48 && ny <= 0.50 && nx >= 0.39 && nx <= 0.61) {
            // Text line 2
            r = 148; g = 163; b = 184;
          } else if (ny >= 0.52 && ny <= 0.53 && nx >= 0.39 && nx <= 0.55) {
            // Text line 3
            r = 203; g = 213; b = 225;
          }
        } else {
          // Folded corner
          r = 203; g = 213; b = 225;
        }
      }
    }
  }

  // Monitor Stand & Base
  // Stand stem: nx from 0.46 to 0.54, ny from 0.64 to 0.72
  if (nx >= 0.46 && nx <= 0.54 && ny >= 0.64 && ny <= 0.72) {
    r = 148; g = 163; b = 184;
  }
  // Base plate: nx from 0.34 to 0.66, ny from 0.72 to 0.76
  if (nx >= 0.34 && nx <= 0.66 && ny >= 0.72 && ny <= 0.76) {
    r = 31; g = 209; b = 249;
  }

  // Offline Wi-Fi with slash / lightning badge in corner (nx 0.68..0.82, ny 0.62..0.78)
  const badgeDx = nx - 0.75;
  const badgeDy = ny - 0.68;
  const badgeDist = Math.hypot(badgeDx, badgeDy);
  if (badgeDist < 0.12) {
    if (badgeDist > 0.10) {
      r = 255; g = 255; b = 255; // White border of badge
    } else {
      // Emerald badge: 100% Offline Ready
      r = 16; g = 185; b = 129;
      // White lightning / check
      if (Math.abs(badgeDx * 1.5 - badgeDy) < 0.03 && Math.abs(badgeDy) < 0.06) {
        r = 255; g = 255; b = 255;
      }
    }
  }

  return [r, g, b, a];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA icons...');

// 1. 192x192 any
fs.writeFileSync(
  path.join(publicDir, 'pwa-192x192.png'),
  createPng(192, 192, (x, y, w, h) => renderMonuIcon(x, y, w, h, false))
);
console.log('Generated pwa-192x192.png');

// 2. 512x512 any
fs.writeFileSync(
  path.join(publicDir, 'pwa-512x512.png'),
  createPng(512, 512, (x, y, w, h) => renderMonuIcon(x, y, w, h, false))
);
console.log('Generated pwa-512x512.png');

// 3. 512x512 maskable (with 15% safe padding)
fs.writeFileSync(
  path.join(publicDir, 'pwa-maskable-512x512.png'),
  createPng(512, 512, (x, y, w, h) => renderMonuIcon(x, y, w, h, true))
);
console.log('Generated pwa-maskable-512x512.png');

// 4. apple-touch-icon 180x180
fs.writeFileSync(
  path.join(publicDir, 'apple-touch-icon.png'),
  createPng(180, 180, (x, y, w, h) => renderMonuIcon(x, y, w, h, false))
);
console.log('Generated apple-touch-icon.png');

// Also copy to root for static servers
const rootIcons = ['pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png', 'apple-touch-icon.png'];
for (const icon of rootIcons) {
  fs.copyFileSync(path.join(publicDir, icon), path.resolve(icon));
}

// 5. SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#312e81" />
      <stop offset="100%" stop-color="#4338ca" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1fd1f9" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="url(#bgGrad)" />

  <!-- Ambient Center Glow -->
  <circle cx="256" cy="256" r="160" fill="#1fd1f9" opacity="0.15" filter="url(#glow)" />

  <!-- Computer Monitor Frame -->
  <rect x="100" y="90" width="312" height="230" rx="20" fill="#0f172a" stroke="url(#cyanGrad)" stroke-width="12" />

  <!-- Document Sheet -->
  <path d="M 175 130 L 290 130 L 335 175 L 335 285 L 175 285 Z" fill="#f8fafc" />
  <!-- Folded Corner -->
  <path d="M 290 130 L 290 175 L 335 175 Z" fill="#cbd5e1" />
  
  <!-- Text lines on Document -->
  <line x1="200" y1="170" x2="270" y2="170" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
  <!-- Scanning Laser Line -->
  <line x1="165" y1="210" x2="345" y2="210" stroke="#10b981" stroke-width="7" stroke-linecap="round" filter="url(#glow)" />
  <line x1="200" y1="245" x2="310" y2="245" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" />
  <line x1="200" y1="265" x2="260" y2="265" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round" />

  <!-- Monitor Stand -->
  <rect x="236" y="320" width="40" height="45" fill="#94a3b8" rx="4" />
  <ellipse cx="256" cy="370" rx="80" ry="14" fill="url(#cyanGrad)" />

  <!-- 100% Offline Badge -->
  <g transform="translate(350, 340)">
    <circle cx="25" cy="25" r="32" fill="#10b981" stroke="#ffffff" stroke-width="4" filter="url(#glow)" />
    <!-- Checkmark & Offline symbol -->
    <path d="M 12 26 L 21 35 L 38 17" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.resolve('icon.svg'), svgContent);
console.log('Generated icon.svg');
