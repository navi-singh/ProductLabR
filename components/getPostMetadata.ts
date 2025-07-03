import fs from "fs";
import matter from "gray-matter";
import { PostMetadata } from "./PostMetadata";

const getPostMetadata = (): PostMetadata[] => {
  const folder = "posts/";
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

  // Get gray-matter data from each file.
  const posts = markdownPosts.map((fileName) => {
    const fileContents = fs.readFileSync(`posts/${fileName}`, "utf8");
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
    };
  });

  return posts;
};

export default getPostMetadata;