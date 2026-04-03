import * as sass from 'sass';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function processCss() {
  const inputFile  = path.join(__dirname, '../_css/src/main.scss');
  const outputFile = path.join(__dirname, '../_css/style.css');

  const result = sass.compile(inputFile, {
    style: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded',
    silenceDeprecations: ['import'],
    quietDeps: true,
  });

  fs.writeFileSync(outputFile, result.css);
  console.log('CSS compiled successfully');
}
