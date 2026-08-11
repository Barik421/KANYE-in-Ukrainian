import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const measurementId = process.env.VITE_GA_MEASUREMENT_ID;

if (!measurementId) {
  console.log('Skipped Google Analytics tag injection: VITE_GA_MEASUREMENT_ID is not set.');
  process.exit(0);
}

if (!/^G-[A-Z0-9]+$/.test(measurementId)) {
  throw new Error('VITE_GA_MEASUREMENT_ID must look like G-XXXXXXXXXX.');
}

const indexPath = resolve('dist/index.html');
const html = await readFile(indexPath, 'utf8');

if (html.includes('googletagmanager.com/gtag/js')) {
  console.log('Google Analytics tag already exists in dist/index.html.');
  process.exit(0);
}

const escapedMeasurementId = JSON.stringify(measurementId);
const tag = `    <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', ${escapedMeasurementId}, { send_page_view: false });
    </script>
`;

await writeFile(indexPath, html.replace('    <script>\n      (() => {', `${tag}    <script>\n      (() => {`));
console.log(`Injected Google Analytics tag for ${measurementId}.`);
