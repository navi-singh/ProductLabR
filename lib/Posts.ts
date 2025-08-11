import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostMetadata } from "../components/PostMetadata";

function findPostFile(slug: string): { filePath: string; category: string } | null {
  const postsDirectory = path.join(process.cwd(), 'posts');
  
  // First try to find in root posts directory (for backward compatibility)
  const rootFile = path.join(postsDirectory, `${slug}.md`);
  if (fs.existsSync(rootFile)) {
    return { filePath: rootFile, category: 'general' };
  }
  
  // Then search in subdirectories
  try {
    const categories = fs.readdirSync(postsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const category of categories) {
      const categoryFile = path.join(postsDirectory, category, `${slug}.md`);
      if (fs.existsSync(categoryFile)) {
        return { filePath: categoryFile, category };
      }
    }
  } catch (error) {
    console.error('Error searching categories:', error);
  }
  
  return null;
}

export function getPostBySlug(slug: string): { metadata: PostMetadata; content: string } | null {
  try {
    const fileInfo = findPostFile(slug);
    if (!fileInfo) {
      console.error(`Post file not found for slug: ${slug}`);
      return null;
    }
    
    const fileContents = fs.readFileSync(fileInfo.filePath, "utf8");
    const matterResult = matter(fileContents);
    
    const metadata: PostMetadata = {
      title: matterResult.data.title,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle,
      slug: slug,
      image: matterResult.data.image,
      heroImage: matterResult.data.heroImage,
      productImage: matterResult.data.productImage,
      author: matterResult.data.author,
      specs: matterResult.data.specs,
      pros: matterResult.data.pros,
      cons: matterResult.data.cons,
      authorBio: matterResult.data.authorBio,
      price: matterResult.data.price,
      rating: matterResult.data.rating,
      retailerLinks: matterResult.data.retailerLinks,
      ratingBreakdown: matterResult.data.ratingBreakdown,
      category: fileInfo.category,
    };

    return {
      metadata,
      content: matterResult.content
    };
  } catch (error) {
    console.error(`Error loading post with slug: ${slug}`, error);
    return null;
  }
}

export function getAllPostSlugs(): string[] {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    let allSlugs: string[] = [];
    
    // Get files from root posts directory (for backward compatibility)
    try {
      const rootFiles = fs.readdirSync(postsDirectory);
      const rootMarkdownPosts = rootFiles
        .filter((file) => file.endsWith(".md"))
        .map((fileName) => fileName.replace(".md", ""));
      allSlugs.push(...rootMarkdownPosts);
    } catch (error) {
      // Root directory might not have files, continue
    }
    
    // Get files from category subdirectories
    try {
      const categories = fs.readdirSync(postsDirectory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const category of categories) {
        const categoryPath = path.join(postsDirectory, category);
        const categoryFiles = fs.readdirSync(categoryPath);
        const categoryMarkdownPosts = categoryFiles
          .filter((file) => file.endsWith(".md"))
          .map((fileName) => fileName.replace(".md", ""));
        allSlugs.push(...categoryMarkdownPosts);
      }
    } catch (error) {
      console.error("Error reading category directories:", error);
    }
    
    return allSlugs;
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}

export function getAllCategories(): string[] {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const categories = fs.readdirSync(postsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    return categories;
  } catch (error) {
    console.error("Error reading categories:", error);
    return [];
  }
}

export function getPostsByCategory(category: string): PostMetadata[] {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const categoryPath = path.join(postsDirectory, category);
    
    if (!fs.existsSync(categoryPath)) {
      return [];
    }
    
    const files = fs.readdirSync(categoryPath);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const posts: PostMetadata[] = [];
    
    for (const file of markdownFiles) {
      const slug = file.replace('.md', '');
      const post = getPostBySlug(slug);
      if (post) {
        posts.push(post.metadata);
      }
    }
    
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error getting posts for category ${category}:`, error);
    return [];
  }
}

export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    'portable-power-stations': 'Portable Power Stations',
    'cameras': 'Cameras & Photography',
    'knives-tools': 'Knives & Tools',
    'general': 'General Reviews'
  };
  
  return displayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
}
