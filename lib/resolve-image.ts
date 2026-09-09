import fs from 'fs';
import path from 'path';

/**
 * Frontmatter image paths are not guaranteed to exist on disk. The UI degrades
 * to a placeholder at runtime, but metadata (OpenGraph, JSON-LD) is emitted as
 * an absolute URL that crawlers fetch, so a missing file becomes a 404 in a
 * social card or a structured-data error. Resolve against the filesystem at
 * build time and only emit a path we know is served.
 */
export function resolvePublicImage(src?: string): string | undefined {
  if (!src || !src.startsWith('/')) return undefined;
  try {
    if (fs.existsSync(path.join(process.cwd(), 'public', src))) return src;
  } catch {
    return undefined;
  }
  return undefined;
}
