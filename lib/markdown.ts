import { marked, Renderer } from 'marked';
import { withBasePath } from './basePath';

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim();
}

function isFaqSection(slug: string, title: string): boolean {
  const normalized = `${slug} ${title}`.toLowerCase();
  return normalized.includes('faq') || normalized.includes('frequently-asked');
}

function isConclusionSection(slug: string, title: string): boolean {
  const normalized = `${slug} ${title}`.toLowerCase();
  return (
    normalized.includes('verdict') ||
    normalized.includes('conclusion') ||
    normalized.includes('final-thought')
  );
}

function wrapFaqItem(question: string, answerHtml: string): string {
  const cleanQuestion = question.replace(/^q:\s*/i, '').trim();
  const cleanAnswer = answerHtml.replace(/^\s*a:\s*/i, '').trim();

  return `<details class="article-faq-item"><summary><span>${cleanQuestion}</span><span class="article-faq-icon" aria-hidden="true">⌄</span></summary><div class="article-faq-answer">${cleanAnswer}</div></details>`;
}

function wrapFaqItems(bodyHtml: string): string {
  const h3Pattern =
    /<div class="article-heading-block article-heading-block-sm"><h3 class="article-heading article-heading-3"><span>([\s\S]*?)<\/span><\/h3><\/div>/g;
  const h3Matches = Array.from(bodyHtml.matchAll(h3Pattern));

  if (h3Matches.length > 0) {
    let faqHtml = bodyHtml.slice(0, h3Matches[0].index ?? 0);

    h3Matches.forEach((match, index) => {
      const questionStart = match.index ?? 0;
      const questionEnd = h3Matches[index + 1]?.index ?? bodyHtml.length;
      const question = match[1];
      const answerHtml = bodyHtml.slice(questionStart + match[0].length, questionEnd);
      faqHtml += wrapFaqItem(question, answerHtml);
    });

    return `<div class="article-faq-list">${faqHtml}</div>`;
  }

  const boldQuestionPattern =
    /<p class="mb-4 leading-relaxed"><strong class="font-bold">([\s\S]*?\?)<\/strong>(?:<br>|\s)*(?:A:\s*)?([\s\S]*?)<\/p>/g;
  let matchedBoldQuestions = false;
  const faqHtml = bodyHtml.replace(boldQuestionPattern, (_, question, answerHtml) => {
    matchedBoldQuestions = true;
    return wrapFaqItem(question, answerHtml);
  });

  return matchedBoldQuestions ? `<div class="article-faq-list">${faqHtml}</div>` : bodyHtml;
}

function wrapArticleSections(html: string): string {
  const h2Pattern =
    /<div class="article-heading-block"><h2 id="([^"]+)" class="article-heading article-heading-2"><span>([\s\S]*?)<\/span><\/h2><\/div>/g;
  const matches = Array.from(html.matchAll(h2Pattern));
  if (matches.length === 0) return html;

  let wrappedHtml = html.slice(0, matches[0].index ?? 0);
  let numberedSectionCount = 0;

  matches.forEach((match, index) => {
    const sectionStart = match.index ?? 0;
    const sectionEnd = matches[index + 1]?.index ?? html.length;
    const headingHtml = match[0];
    const slug = match[1];
    const title = stripTags(match[2]);
    const isFaq = isFaqSection(slug, title);
    const isConclusion = isConclusionSection(slug, title);
    const bodyHtml = html.slice(sectionStart + headingHtml.length, sectionEnd);
    const sectionClass = isFaq
      ? 'article-section-card article-section-card--faq'
      : isConclusion
        ? 'article-section-card article-section-card--conclusion'
        : 'article-section-card';
    const kicker = isFaq
      ? 'Frequently Asked Questions'
      : isConclusion
        ? 'Final Verdict'
        : `Section ${String(++numberedSectionCount).padStart(2, '0')}`;
    const contentHtml = isFaq ? wrapFaqItems(bodyHtml) : bodyHtml;

    wrappedHtml += `<section class="${sectionClass}" aria-labelledby="${slug}"><div class="article-section-header"><div class="article-section-kicker">${kicker}</div>${headingHtml}</div><div class="article-section-content">${contentHtml}</div></section>`;
  });

  return wrappedHtml;
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

    // Style headings with the same editorial/lab treatment as the review shell.
    styledHtml = styledHtml.replace(
      /<h1>(.*?)<\/h1>/g,
      '<div class="article-heading-block article-heading-block-lg"><h1 class="article-heading article-heading-1"><span>$1</span></h1></div>',
    );
    styledHtml = styledHtml.replace(/<h2>(.*?)<\/h2>/g, (_, inner) => {
      const slug = inner
        .replace(/<[^>]*>/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      return `<div class="article-heading-block"><h2 id="${slug}" class="article-heading article-heading-2"><span>${inner}</span></h2></div>`;
    });
    styledHtml = styledHtml.replace(
      /<h3>(.*?)<\/h3>/g,
      '<div class="article-heading-block article-heading-block-sm"><h3 class="article-heading article-heading-3"><span>$1</span></h3></div>',
    );
    styledHtml = styledHtml.replace(/<h4>/g, '<h4 class="article-heading-4">');

    // Style paragraphs
    styledHtml = styledHtml.replace(/<p>/g, '<p class="mb-4 leading-relaxed">');

    // Style lists
    styledHtml = styledHtml.replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-2">');
    styledHtml = styledHtml.replace(
      /<ol>/g,
      '<ol class="list-decimal list-inside mb-4 space-y-2">',
    );
    styledHtml = styledHtml.replace(/<li>/g, '<li class="mb-2">');

    // Style links
    styledHtml = styledHtml.replace(/<a /g, '<a class="text-primary hover:underline" ');

    // Style emphasis
    styledHtml = styledHtml.replace(/<strong>/g, '<strong class="font-bold">');
    styledHtml = styledHtml.replace(/<em>/g, '<em class="italic">');

    // Style blockquotes
    styledHtml = styledHtml.replace(/<blockquote>/g, '<blockquote class="article-callout">');

    // Style code
    styledHtml = styledHtml.replace(/<code>/g, '<code class="article-code">');
    styledHtml = styledHtml.replace(/<pre>/g, '<pre class="article-pre">');

    // An all-italic paragraph directly beneath an image is a caption, not body
    // copy. Style it as one so the attribution reads as a credit line.
    styledHtml = styledHtml.replace(
      /(<p class="mb-4 leading-relaxed"><img[^>]*><\/p>)\s*<p class="mb-4 leading-relaxed"><em class="italic">([\s\S]*?)<\/em><\/p>/g,
      '$1<p class="-mt-4 mb-6 text-center text-sm text-neutral-500">$2</p>',
    );

    return wrapArticleSections(styledHtml);
  } catch (error) {
    console.error('Error processing markdown:', error);
    return content;
  }
}
