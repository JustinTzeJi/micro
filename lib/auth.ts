import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const getSession = () => {
  return getServerSession(authOptions);
};

export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user;
};

export const getOwnerUsername = () => {
  return process.env.BLOG_OWNER_GITHUB_USERNAME;
};

export const isOwner = async () => {
  const currentUser = await getCurrentUser();
  const ownerUsername = getOwnerUsername();
  return currentUser?.username === ownerUsername;
};
