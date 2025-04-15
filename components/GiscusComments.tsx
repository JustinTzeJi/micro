"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

interface GiscusCommentsProps {
  mappingTerm: string;
}

export function GiscusComments({ mappingTerm }: GiscusCommentsProps) {
  const { resolvedTheme } = useTheme();

  const owner = process.env.NEXT_PUBLIC_GISCUS_OWNER!;
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO!;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID!;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY!;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!;
  console.log(`${owner}/${repo}`);

  if (!repo || !repoId || !categoryId) {
    console.error("Giscus configuration missing in environment variables.");
    return (
      <div className="text-red-500 p-4">
        Giscus comments cannot load. Configuration missing.
      </div>
    );
  }

  return (
    <div className="mt-12 pt-6 border-t">
      <h2 className="text-l font-semibold mb-4">Comments & Reactions</h2>
      <div className="max-h-1/4">
        <Giscus
          id="comments"
          repo={`${owner}/${repo}`}
          repoId={repoId}
          category={category}
          categoryId={categoryId}
          mapping="number"
          term={mappingTerm}
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme={resolvedTheme === "dark" ? "noborder_gray" : "noborder_light"}
          lang="en"
          loading="lazy"
        />
      </div>
    </div>
  );
}
