// EPUB text extraction via JSZip — regex-based XML parsing (no DOMParser),
// so this works identically on native and web, unlike pdf-text.ts/
// pdf-text.web.ts which had to be platform-split (see that file's header).
import JSZip from 'jszip';

function attr(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
}

// Joins an EPUB-internal relative href against the .opf file's directory,
// resolving "../" segments — no DOMParser/URL base-resolution dependency.
function joinEpubPath(baseDir: string, rel: string): string {
  const stack = baseDir.split('/').filter(Boolean);
  for (const seg of rel.split('/')) {
    if (seg === '..') stack.pop();
    else if (seg === '.' || seg === '') continue;
    else stack.push(seg);
  }
  return stack.join('/');
}

function stripHtml(html: string): string {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function extractEpubText(data: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(data);

  const containerXml = await zip.file('META-INF/container.xml')?.async('string');
  const opfPath = containerXml?.match(/<rootfile[^>]*full-path="([^"]+)"/)?.[1];
  if (!opfPath) throw new Error('Invalid EPUB: missing container.xml rootfile');

  const opfXml = await zip.file(opfPath)?.async('string');
  if (!opfXml) throw new Error('Invalid EPUB: missing content.opf');
  const baseDir = opfPath.replace(/[^/]*$/, '');

  const manifest: Record<string, string> = {};
  const itemRe = /<item\b[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(opfXml))) {
    const id = attr(m[0], 'id');
    const href = attr(m[0], 'href');
    if (id && href) manifest[id] = href;
  }

  const spineIds: string[] = [];
  const itemrefRe = /<itemref\b[^>]*idref="([^"]+)"/g;
  while ((m = itemrefRe.exec(opfXml))) spineIds.push(m[1]);
  if (spineIds.length === 0) throw new Error('Invalid EPUB: empty spine');

  let text = '';
  for (const id of spineIds) {
    const href = manifest[id];
    if (!href) continue;
    const full = decodeURIComponent(joinEpubPath(baseDir, href));
    const file = zip.file(full) ?? zip.file(baseDir + href) ?? zip.file(href);
    if (!file) continue;
    text += stripHtml(await file.async('string')) + '\n\n';
  }
  return text.trim();
}
