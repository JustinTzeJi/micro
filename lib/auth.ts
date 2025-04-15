import { getServerSession } from "next-auth/next";
import { AuthOptions, User } from "next-auth";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    username?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile: GithubProfile): User {
        return {
          ...profile,
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      if (user?.username) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (token.username && session.user) {
        session.user.username = token.username;
      }
      return session;
    },
  },
};

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
