import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createDiscussion } from "@/lib/github";

export const runtime = 'edge';

export async function POST(request: Request) {
  const session = await getSession();
  const ownerUsername = process.env.BLOG_OWNER_GITHUB_USERNAME;

  if (!session?.user?.username || session.user.username !== ownerUsername) {
    return NextResponse.json(
      { message: "Unauthorized: Only the blog owner can post." },
      { status: 403 }
    );
  }
  if (!session.accessToken) {
    return NextResponse.json(
      { message: "Unauthorized: Access Token missing." },
      { status: 401 }
    );
  }

  try {
    const { body, title } = await request.json();

    if (!body || typeof body !== "string" || body.trim().length === 0) {
      return NextResponse.json(
        { message: "Post body cannot be empty" },
        { status: 400 }
      );
    }

    const result = await createDiscussion(
      title || "",
      body,
      session.accessToken
    );

    if (!result) {
      throw new Error(
        "Failed to create discussion via GitHub API. Check server logs."
      );
    }

    return NextResponse.json(
      { success: true, url: result.url, id: result.id, number: result.number },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API Error creating post:", error);
    return NextResponse.json(
      { message: error.message || "Failed to post" },
      { status: 500 }
    );
  }
}
