import { getDiscussions } from "@/lib/github";
import { PostCard } from "@/components/PostCard";
import { PostForm } from "@/components/PostForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const revalidate = 60;

export default async function HomePage() {
  const { posts } = await getDiscussions(15);
  // const { posts, pageInfo } = await getDiscussions(15);

  return (
    <div>
      <PostForm />
      <Tabs defaultValue="random" className="w-full ">
        <TabsList className=" sticky top-14 z-30 grid w-full grid-cols-2 h-12 bg-blend-darken dark:bg-background dark:border-y-1 rounded-none px-2">
          <TabsTrigger value="random">Random Posts</TabsTrigger>
          <TabsTrigger value="long">Long Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="random">
          <div className="px-4">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-center text-muted-foreground mt-10">
                No posts yet. Time to write something!
              </p>
            )}
            {/* TODO: Add pagination/infinite scroll based on pageInfo */}
        </div>
        </TabsContent>
        <TabsContent value="long">
          <div className="px-4">
            <p className="text-center text-muted-foreground mt-10">
              No posts yet. Time to write something!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
