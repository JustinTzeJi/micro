import { getDiscussion } from "@/lib/github";
import { notFound } from "next/navigation";
import { GiscusComments } from "@/components/GiscusComments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// export const revalidate = 60;

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

  const timeAgo = post
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "";

  return (
    <article className="max-w-3xl mx-auto px-4">
      <div className="pb-4">
        {post.author && (
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={post.author.avatarUrl}
                alt={post.author.login}
              />
              <AvatarFallback>{post.author.login.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold">{post.author.login}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      Posted {timeAgo}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    {new Date(post.createdAt).toString()}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>

      <div className="prose lg:prose-lg dark:prose-invert max-w-none px-6">
        <Markdown remarkPlugins={[remarkGfm]}>{post.body}</Markdown>
      </div>
      <GiscusComments mappingTerm={number} />
    </article>
  );
}
