// src/app/category/[category]/page.tsx
import Link from "next/link";
import { getPostsByCategory, getAllPublishedPosts } from "@/lib/notion";
import BlogCard from "@/components/BlogCard";

export async function generateStaticParams() {
  const posts = await getAllPublishedPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
  return categories.map((cat) => ({ category: cat.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const displayName = decodeURIComponent(category)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${displayName} — The Biscoff Brief`,
    description: `All stories in ${displayName}`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = await getPostsByCategory(decodeURIComponent(category));
  const displayName = decodeURIComponent(category)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="max-w-300 mx-auto px-6 pt-32 pb-24">
      <div className="mb-12">
        <Link href="/" className="text-sm headline hover:opacity-70 transition-opacity mb-6 block" style={{ color: "var(--accent)" }}>
          ← Back
        </Link>
        <p className="eyebrow mb-3">{displayName}</p>
        <h1 className="headline text-5xl md:text-6xl">
          {posts.length} {posts.length === 1 ? "story" : "stories"}
        </h1>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>
          No stories in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}