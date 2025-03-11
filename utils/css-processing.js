import * as sass from 'sass'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function processSass() {
  // Main SCSS file path
  const mainScssFile = path.join(__dirname, '../_sass/main.scss');
  const outputCssFile = path.join(__dirname, '../_site2/assets/css/main.css');
  
  // Ensure the output directory exists
  const outputDir = path.dirname(outputCssFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Compile SCSS to CSS
  const result = sass.compile(mainScssFile, {
    style: 'compressed',
    loadPaths: [
      path.join(__dirname, '../_sass')
    ],
    silenceDeprecations: ["global-builtin", "color-functions", "import"],
    quietDeps: true
  });

  // Write CSS to output file
  fs.writeFileSync(outputCssFile, result.css);
  
  console.log('SCSS compiled successfully');
  
  return result.css;
}