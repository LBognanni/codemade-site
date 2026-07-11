import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function () {
  const cssPath = path.join(__dirname, '../_css/style.css');
  const css = fs.readFileSync(cssPath);
  return {
    version: crypto.createHash('md5').update(css).digest('hex').slice(0, 8),
  };
}
