import Link from "next/link";
import Image from "next/image";
import { PostMetadata } from "./PostMetadata";

const PostPreview = (props: PostMetadata) => {
  return (
    <div className="border border-slate-300 p-4 rounded-md shadow-sm bg-white">
      <div className="flex gap-4">
        {/* {props.image && (
          <div className="flex-shrink-0">
            <Image
              src={props.image}
              alt={props.title}
              width={120}
              height={120}
              className="w-30 h-30 object-cover rounded-md"
              unoptimized={true}
            />
          </div>
        )} */}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-400 mb-2">{props.date}</p>
          
          <Link href={`/posts/${props.slug}`}>
            <h2 className="text-violet-600 hover:underline mb-2 font-semibold leading-tight">
              {props.title}
            </h2>
          </Link>
          
          {/* {props.subtitle && (
            <p className="text-sm text-slate-600 line-clamp-2">
              {props.subtitle}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default PostPreview;