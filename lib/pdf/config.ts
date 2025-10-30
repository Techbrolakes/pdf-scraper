import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';

// Configure pdfjs-dist for server-side (Node.js) usage
if (typeof window === 'undefined') {
  // Point to the worker file in node_modules
  // Using a path-like string that pdfjs can validate (it won't actually be used in Node.js)
  const workerPath = path.join(
    process.cwd(),
    'node_modules',
    'pdfjs-dist',
    'legacy',
    'build',
    'pdf.worker.min.mjs'
  );
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
}

export { pdfjsLib };
