import fs from "fs";
import getPostMetadata from '@/components/getPostMetadata';
import matter from "gray-matter";
import Markdown from 'markdown-to-jsx';


const getPostContent = (slug: string) => {
  const folder = "posts/";
  const file = `${folder}${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);
  return matterResult;
};

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  })); 
};

type PropType = {
  params: { slug: string }; 
};


export default async function Page({params}: PropType) {
  const {slug} = params;
  const post = getPostContent(slug);
  return (
    <article className="prose-lg my-12 w-full md:w-4/5 mx-auto">
      <Markdown>{post.content}</Markdown>
    </article>
  
);
};

    // <div className="flex min-h-screen flex-col">
    //   <main className="container mx-auto flex-grow px-4 py-8">
    //     <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
    //       <div>
    //         <main className="container mx-auto flex flex-grow flex-col px-4 py-8 md:flex-row">
    //           <nav className="mb-4 text-sm">
    //             <Link href="/">Home</Link> &gt; <Link href="/outdoor">Outdoor</Link> &gt;{' '}
    //             <Link href="/hunt-fish">Hunt & Fish {props.params.id}</Link>
    //           </nav>
    //           <div className="my-12 text-center">
    //             <h1 className="text-2xl text-slate-600 ">{post.data.title}</h1>
    //             <p className="text-slate-400 mt-2">{post.data.date}</p>
    //           </div>
    //           <article className="prose">
    //             <Markdown>{post.content}</Markdown>
    //           </article>
    //         </main>
    //       </div>
    //       <Top10Popular />
    //     </div>
    //   </main>
    // </div>
//   );
// }

