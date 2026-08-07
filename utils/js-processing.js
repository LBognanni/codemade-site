import { build } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function processJavaScript() {
  return build({
    entryPoints: [path.join(__dirname, '../assets/js/main.js')],
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    outfile: path.join(__dirname, '../assets/js/app.js'),
    target: 'es2020'
  });
}
