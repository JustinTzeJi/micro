"use client";

import Link from "next/link";
import { DiscussionPost } from "@/lib/github";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import Markdown from "react-markdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import remarkGfm from "remark-gfm";

interface PostCardProps {
  post: DiscussionPost;
}

export function PostCard({ post }: PostCardProps) {
  if (!post.author) return null;

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  const MAX_CHARS = 280;

  let displayMarkdown: string;
  let wasTruncated: boolean;
  if (post.body.length <= MAX_CHARS) {
    displayMarkdown = post.body;
    wasTruncated = false;
  } else {
    displayMarkdown = post.body.substring(0, MAX_CHARS) + "...";
    wasTruncated = true;
  }

  return (
    <Card className="break-inside-avoid bg-background border-x-0 border-t-0 border-b-1 rounded-none shadow-none">
      <div className="flex-row flex space-x-3">
        <Avatar className="h-12 w-12 align-top">
          <AvatarImage src={post.author.avatarUrl} alt={post.author.login} />
          <AvatarFallback>{post.author.login.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-3 w-full">
          <CardHeader className="align-top px-0">
            <div className="flex space-x-2 items-baseline">
              <CardTitle className="text-base font-semibold">
                {post.author.login}
              </CardTitle>
              <span className="text-xs text-muted-foreground ">
                @{post.author.login.toLowerCase()}
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-fit">
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
          </CardHeader>
          <CardContent className="px-0">
            <div className="prose prose-sm dark:prose-invert w-full max-h-50 overflow-clip">
              <Markdown remarkPlugins={[remarkGfm]}>{displayMarkdown}</Markdown>
            </div>
          </CardContent>
          <CardFooter className="mx-auto">
            <Button asChild variant="outline">
              <Link href={`/post/${post.number}`} className="text-sm">
                {/* Change link text if content was truncated */}
                {wasTruncated ? "Read More & Comments" : `View Post & Comments`}
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
