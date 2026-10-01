// Native fallback: pdfjs-dist's browser build uses a dynamic `import()` for
// its worker that Hermes' compiler hard-fails on (confirmed via
// `expo export --platform ios`, not a guess) — bundling it into the native
// app would break the whole native build, not just PDF upload. pdf-text.web.ts
// provides the real implementation; Metro picks it automatically on web via
// the .web.ts extension, so this file (and pdfjs-dist) never reaches the
// native bundle at all.
export async function extractPdfText(
  _data: ArrayBuffer,
  _onProgress?: (page: number, total: number) => void
): Promise<string> {
  throw new Error('PDF upload isn’t supported on this device yet — try the web version.');
}
