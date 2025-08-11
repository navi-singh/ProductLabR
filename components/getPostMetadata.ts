import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostMetadata } from "./PostMetadata";

const getPostMetadata = (): PostMetadata[] => {
  const postsDirectory = "posts/";
  let allPosts: PostMetadata[] = [];

  try {
    // Get files from root posts directory (for backward compatibility)
    try {
      const rootFiles = fs.readdirSync(postsDirectory);
      const rootMarkdownPosts = rootFiles.filter((file) => file.endsWith(".md"));
      
      const rootPosts = rootMarkdownPosts.map((fileName) => {
        const fileContents = fs.readFileSync(path.join(postsDirectory, fileName), "utf8");
        const matterResult = matter(fileContents);
        return {
          title: matterResult.data.title,
          date: matterResult.data.date,
          subtitle: matterResult.data.subtitle,
          slug: fileName.replace(".md", ""),
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
          category: 'general',
          ratingBreakdown: matterResult.data.ratingBreakdown,
        };
      });
      
      allPosts.push(...rootPosts);
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
        const categoryMarkdownPosts = categoryFiles.filter((file) => file.endsWith(".md"));

        const categoryPosts = categoryMarkdownPosts.map((fileName) => {
          const fileContents = fs.readFileSync(path.join(categoryPath, fileName), "utf8");
          const matterResult = matter(fileContents);
          return {
            title: matterResult.data.title,
            date: matterResult.data.date,
            subtitle: matterResult.data.subtitle,
            slug: fileName.replace(".md", ""),
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
            category: category,
            ratingBreakdown: matterResult.data.ratingBreakdown,
          };
        });

        allPosts.push(...categoryPosts);
      }
    } catch (error) {
      console.error("Error reading category directories:", error);
    }

    // Sort by date (newest first)
    allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  } catch (error) {
    console.error("Error reading posts directory:", error);
  }

  return allPosts;
};

export default getPostMetadata;