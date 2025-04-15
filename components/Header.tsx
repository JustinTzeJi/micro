import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkIcon, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export interface UserProfileData {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  websiteUrl: string | null;
}

interface UserProfileHeaderProps {
  user: UserProfileData;
  className?: string;
}

export function UserProfileHeader({ user, className }: UserProfileHeaderProps) {
  const displayWebsiteUrl = user.websiteUrl?.replace(/^https?:\/\//, "");
  const linkWebsiteUrl = user.websiteUrl?.startsWith("http")
    ? user.websiteUrl
    : `https://${user.websiteUrl}`;

  return (
    <div className={cn(className)}>
      <div className="h-30 md:h-40 w-full bg-muted dark:bg-zinc-800"></div>
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="-mt-12 sm:-mt-16 z-10">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background">
              <AvatarImage src={user.avatarUrl} alt={user.name ?? user.login} />
              <AvatarFallback className="text-3xl sm:text-4xl">
                {(user.name ?? user.login).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="pt-4">
            <Button variant="outline" size="sm">
              <Link
                href={`https://github.com/${user.login}/micro`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View code on GitHub
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-2">
          <h1 className="text-xl sm:text-2xl font-bold">
            {user.name ?? user.login}
          </h1>
          <p className="text-sm text-muted-foreground">@{user.login}</p>

          {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{user.location}</span>
              </div>
            )}
            {user.websiteUrl && displayWebsiteUrl && (
              <div className="flex items-center">
                <LinkIcon className="w-4 h-4 mr-1" />
                <a
                  href={linkWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {displayWebsiteUrl}
                </a>
              </div>
            )}
            {user.login && (
              <div className="flex items-center">
                <GithubIcon className="w-4 h-4 mr-1" />
                <a
                  href={`https://github.com/${user.login}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {`github.com/${user.login}`}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileHeader() {
  const userProfileData: UserProfileData = {
    login: "justintzeji",
    name: `Justin`,
    avatarUrl: "https://avatars.githubusercontent.com/u/35253747",
    bio: "This is a placeholder bio. Fetch the real one!",
    location: "Petaling Jaya, MY",
    websiteUrl: "https://iwa.my",
  };

  if (!userProfileData) {
    notFound();
  }

  return <UserProfileHeader user={userProfileData} />;
}

export function NavHeader() {
  return (
    <header className="sticky top-0 z-40 w-full px-4 border-b-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold sm:inline-block">micro</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
