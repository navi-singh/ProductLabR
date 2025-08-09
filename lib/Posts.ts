import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostMetadata } from "../components/PostMetadata";

export function getPostBySlug(slug: string): { metadata: PostMetadata; content: string } | null {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const fileName = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fileName, "utf8");
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
    const files = fs.readdirSync(postsDirectory);
    const markdownPosts = files.filter((file) => file.endsWith(".md"));
    return markdownPosts.map((fileName) => fileName.replace(".md", ""));
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}
