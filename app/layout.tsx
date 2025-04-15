import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils"; // Shadcn utility
import { NavHeader, ProfileHeader } from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "My Microblog",
  description: "Personal thoughts and posts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto px-auto border-1",
          inter.variable
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <NavHeader />
            <ProfileHeader />
            <main className="flex-1 container">{children}</main>
            <footer className="py-6 md:px-8 md:py-0 border-t mt-3">
              <div className="container flex flex-col items-center justify-center gap-4 md:h-12 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground">
                  Powered by GitHub Discussions & Giscus.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
