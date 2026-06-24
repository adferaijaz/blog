// src/app/tag/[tag]/page.tsx
import Link from "next/link";
import { getPostsByTag, getAllPublishedPosts } from "@/lib/notion";
import BlogCard from "@/components/BlogCard";

export async function generateStaticParams() {
  const posts = await getAllPublishedPosts();
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));
  return tags.map((tag) => ({ tag: tag.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const displayName = decodeURIComponent(tag)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${displayName} — The Biscoff Brief`,
    description: `All stories tagged with ${displayName}`,
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = await getPostsByTag(decodeURIComponent(tag));
  const displayName = decodeURIComponent(tag)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="max-w-300 mx-auto px-6 pt-32 pb-24">
      <div className="mb-12">
        <Link href="/" className="text-sm headline hover:opacity-70 transition-opacity mb-6 block" style={{ color: "var(--accent)" }}>
          ← Back
        </Link>
        <p className="eyebrow mb-3">Tag</p>
        <h1 className="headline text-5xl md:text-6xl mb-4">{displayName}</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {posts.length} {posts.length === 1 ? "story" : "stories"}
        </p>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>
          No stories with this tag yet.
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