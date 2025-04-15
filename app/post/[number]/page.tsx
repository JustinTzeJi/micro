import { getDiscussion } from "@/lib/github";
import { notFound } from "next/navigation";
import { GiscusComments } from "@/components/GiscusComments";
import Link from "next/link";
// import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CalendarDaysIcon } from "lucide-react";

export const revalidate = 60;

// interface PostPageProps {
//   params: {
//     number: string;
//   };
// }

export async function generateMetadata({ params }: any) {
  const { number } = await params;
  const postNumber = parseInt(number, 10);
  if (isNaN(postNumber)) return { title: "Post Not Found" };

  const post = await getDiscussion(postNumber);
  if (!post) return { title: "Post Not Found" };

  const bodyText = post.title.substring(0, 100);

  return {
    title: `Post by ${post.author?.login || "User"}: ${bodyText}...`,
  };
}

export default async function PostPage({ params }: any) {
  const { number } = await params;
  const postNumber = parseInt(number, 10);

  if (isNaN(postNumber)) {
    notFound();
  }

  const post = await getDiscussion(postNumber);

  if (!post) {
    notFound();
  }

  // const timeAgo = post
  //   ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
  //   : "";

  return (
    <article className="max-w-3xl mx-2 pb-4 px-6 border-1 rounded-md bg-accent/30">

      <div className="prose lg:prose-lg dark:prose-invert max-w-none py-6">
        <Markdown remarkPlugins={[remarkGfm]}>{post.body}</Markdown>
      </div>
      <div className="py-4">
        {post.author && (
          <div className="flex items-center pb-0">
            <CalendarDaysIcon className="w-4 h-4 mr-1 text-muted-foreground" />
            <Link
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline truncate"
            >
              {new Date(post.createdAt).toLocaleDateString('en-US', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  weekday: 'short'
}).toString()}
            </Link>
          </div>
        )}
      </div>
      <GiscusComments mappingTerm={number} />
    </article>
  );
}
