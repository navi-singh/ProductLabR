import { marked } from 'marked';

export function processMarkdownContent(content: string): string {
  try {
    // Configure marked for better output
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    
    // Convert markdown to HTML
    const html = marked(content);
    
    // Add Tailwind classes to the generated HTML
    let styledHtml = html as string;
    
    // Style headings
    styledHtml = styledHtml.replace(/<h1>/g, '<h1 class="text-3xl font-bold mb-6 mt-10">');
    styledHtml = styledHtml.replace(/<h2>/g, '<h2 class="text-2xl font-bold mb-4 mt-8">');
    styledHtml = styledHtml.replace(/<h3>/g, '<h3 class="text-xl font-semibold mb-3 mt-6">');
    styledHtml = styledHtml.replace(/<h4>/g, '<h4 class="text-lg font-semibold mb-2 mt-4">');
    
    // Style paragraphs
    styledHtml = styledHtml.replace(/<p>/g, '<p class="mb-4 leading-relaxed">');
    
    // Style lists
    styledHtml = styledHtml.replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-2">');
    styledHtml = styledHtml.replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-2">');
    styledHtml = styledHtml.replace(/<li>/g, '<li class="mb-2">');
    
    // Style links
    styledHtml = styledHtml.replace(/<a /g, '<a class="text-blue-600 hover:underline" ');
    
    // Style emphasis
    styledHtml = styledHtml.replace(/<strong>/g, '<strong class="font-bold">');
    styledHtml = styledHtml.replace(/<em>/g, '<em class="italic">');
    
    // Style blockquotes
    styledHtml = styledHtml.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">');
    
    // Style code
    styledHtml = styledHtml.replace(/<code>/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">');
    styledHtml = styledHtml.replace(/<pre>/g, '<pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto">');
    
    return styledHtml;
  } catch (error) {
    console.error('Error processing markdown:', error);
    return content;
  }
}
