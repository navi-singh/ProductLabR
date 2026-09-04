import { marked, Renderer } from 'marked';
import { withBasePath } from './basePath';

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function processMarkdownContent(content: string): string {
  try {
    // Strip raw HTML blocks to prevent XSS via inline HTML in .md files
    const renderer = new Renderer();
    renderer.html = () => '';

    // Inline markdown images bypass next/image, so nothing else prefixes the
    // basePath for them. Without this every in-body image 404s on GitHub Pages,
    // which serves the site from /ProductLabR.
    renderer.image = ({ href, title, text }) => {
      const src = escapeAttr(withBasePath(href ?? ''));
      const alt = escapeAttr(text ?? '');
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
      return `<img src="${src}" alt="${alt}"${titleAttr} loading="lazy" decoding="async" class="mx-auto my-6 h-auto max-h-96 w-auto max-w-full rounded-xl border border-neutral-200" />`;
    };

    marked.use({ renderer });

    // Configure marked for better output
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // Convert markdown to HTML
    const html = marked(content);
    
    // Add Tailwind classes to the generated HTML
    let styledHtml = html as string;

    // Style headings with a 2px border on the heading and background only behind the text
    styledHtml = styledHtml.replace(
      /<h1>(.*?)<\/h1>/g,
      '<div class="mb-8 mt-12"><h1 class="text-2xl font-bold uppercase tracking-wider w-full inline-block" style="border-bottom:2px solid #007ACC;letter-spacing:0.08em;"><span style="background-color:#007ACC;color:#fff;padding:0.5rem 1.5rem;border-radius:0.2rem;">$1</span></h1></div>'
    );
    styledHtml = styledHtml.replace(
      /<h2>(.*?)<\/h2>/g,
      (_, inner) => {
        const slug = inner
          .replace(/<[^>]*>/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        return `<div class="mb-6 mt-10"><h2 id="${slug}" class="text-xl font-bold uppercase tracking-wide w-full inline-block" style="border-bottom:2px solid #007ACC;letter-spacing:0.07em;"><span style="background-color:#007ACC;color:#fff;padding:0.25rem 1.25rem;border-radius:0.2rem;">${inner}</span></h2></div>`;
      }
    );
    styledHtml = styledHtml.replace(
      /<h3>(.*?)<\/h3>/g,
      '<div class="mb-4 mt-8" style="padding-left:1rem;"><h3 class="text-lg font-semibold uppercase tracking-wide w-full inline-block" style="border-bottom:2px solid #007ACC;letter-spacing:0.06em;"><span style="background-color:#007ACC;color:#fff;padding:0.25rem 1rem;border-radius:0.2rem;">$1</span></h3></div>'
    );
    styledHtml = styledHtml.replace(/<h4>/g, '<h4 class="text-lg font-semibold mb-2 mt-4">');
    
    // Style paragraphs
    styledHtml = styledHtml.replace(/<p>/g, '<p class="mb-4 leading-relaxed">');
    
    // Style lists
    styledHtml = styledHtml.replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-2">');
    styledHtml = styledHtml.replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-2">');
    styledHtml = styledHtml.replace(/<li>/g, '<li class="mb-2">');
    
    // Style links
    styledHtml = styledHtml.replace(/<a /g, '<a class="text-primary hover:underline" ');
    
    // Style emphasis
    styledHtml = styledHtml.replace(/<strong>/g, '<strong class="font-bold">');
    styledHtml = styledHtml.replace(/<em>/g, '<em class="italic">');
    
    // Style blockquotes
    styledHtml = styledHtml.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">');
    
    // Style code
    styledHtml = styledHtml.replace(/<code>/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">');
    styledHtml = styledHtml.replace(/<pre>/g, '<pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto">');

    // An all-italic paragraph directly beneath an image is a caption, not body
    // copy. Style it as one so the attribution reads as a credit line.
    styledHtml = styledHtml.replace(
      /(<p class="mb-4 leading-relaxed"><img[^>]*><\/p>)\s*<p class="mb-4 leading-relaxed"><em class="italic">([\s\S]*?)<\/em><\/p>/g,
      '$1<p class="-mt-4 mb-6 text-center text-sm text-neutral-500">$2</p>'
    );

    return styledHtml;
  } catch (error) {
    console.error('Error processing markdown:', error);
    return content;
  }
}
