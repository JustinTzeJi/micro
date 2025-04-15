"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function PostForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner =
    session?.user?.username ===
    process.env.NEXT_PUBLIC_BLOG_OWNER_GITHUB_USERNAME;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session?.user || !isOwner) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post");
      }

      setContent("");
      router.refresh();
    } catch (err: any) {
      console.error("Posting failed:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOwner || !session?.user) {
    return null;
  }

  return (
    <Card className="mb-6 py-1 mx-2">
      <CardContent className="px-4 py-2">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10 mt-1">
              <AvatarImage
                src={session.user?.image ?? undefined}
                alt={session.user?.name ?? "User"}
              />
              <AvatarFallback>
                {session.user?.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full resize-none border-0 shadow-none focus-visible:ring-0 p-4"
                rows={3}
                maxLength={5000}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2 pl-12">{error}</p>}
          <div className="flex justify-end mt-3">
            <Button type="submit" disabled={!content.trim() || isLoading} className="max-h-8">
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
