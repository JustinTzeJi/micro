"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut } from "lucide-react"; // Icons

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={session.user?.image ?? undefined}
            alt={session.user?.name ?? "User"}
          />
          <AvatarFallback>
            {session.user?.name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="sm" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={() => signIn("github")}>
      <LogIn className="mr-2 h-4 w-4" /> Sign In with GitHub
    </Button>
  );
}
