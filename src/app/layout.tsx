// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllPublishedPosts } from "@/lib/notion";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "The Biscoff Brief — Stories Worth Your Time",
  description: "Curated insights on culture, technology, and ideas.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch categories from all published posts to populate navbar + footer
  const posts = await getAllPublishedPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))).sort();

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <ThemeProvider>
          <Navbar categories={categories} />
          <main>{children}</main>
          <Footer categories={categories} />
        </ThemeProvider>
      </body>
    </html>
  );
}