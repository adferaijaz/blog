// src/app/page.tsx
import Link from "next/link";
import { getAllPublishedPosts, getFeaturedPosts } from "@/lib/notion";
import Hero from "@/components/Hero";
import BlogCard from "@/components/BlogCard";

export const metadata = {
  title: "The Biscoff Brief — Stories Worth Your Time",
  description: "Curated insights on culture, technology, and ideas.",
};

export default async function HomePage() {
  const [featured, allPosts] = await Promise.all([
    getFeaturedPosts(),
    getAllPublishedPosts(),
  ]);

  // Latest posts (excluding featured, most recent first)
  const featuredIds = new Set(featured.map((p) => p.id));
  const latestPosts = allPosts.filter((p) => !featuredIds.has(p.id)).slice(0, 6);

  // Group posts by category
  const categories = Array.from(new Set(allPosts.map((p) => p.category).filter(Boolean))).sort();
  const postsByCategory = Object.fromEntries(
    categories.map((cat) => [
      cat,
      allPosts.filter((p) => p.category === cat).slice(0, 4),
    ])
  );

  return (
    <>
      {/* Hero carousel with featured posts */}
      <Hero posts={featured} />

      {/* Latest stories section */}
      {latestPosts.length > 0 && (
        <section className="max-w-300 mx-auto px-6 py-20 md:py-32">
          <div className="mb-12">
            <p className="eyebrow mb-3">What&apos;s new</p>
            <h2 className="headline text-4xl md:text-5xl">Latest stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Category sections */}
      {categories.map((category, idx) => {
        const posts = postsByCategory[category] || [];
        if (posts.length === 0) return null;

        return (
          <section
            key={category}
            className={`max-w-300 mx-auto px-6 py-20 md:py-32 ${
              idx > 0 ? "border-t" : ""
            }`}
            style={{ borderColor: idx > 0 ? "var(--border-subtle)" : "transparent" }}
          >
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="eyebrow mb-3">{category}</p>
                <h2 className="headline text-3xl md:text-4xl">
                  {category} stories
                </h2>
              </div>
              <Link
                href={`/category/${encodeURIComponent(category.toLowerCase())}`}
                className="text-sm headline hidden md:block hover:opacity-70 transition-opacity"
                style={{ color: "var(--accent)" }}
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <Link
              href={`/category/${encodeURIComponent(category.toLowerCase())}`}
              className="block md:hidden mt-8 text-sm headline text-center hover:opacity-70 transition-opacity"
              style={{ color: "var(--accent)" }}
            >
              View all {category} stories →
            </Link>
          </section>
        );
      })}

      {/* If no posts at all, show a helpful message */}
      {allPosts.length === 0 && (
        <section className="max-w-300 mx-auto px-6 py-32 text-center">
          <p style={{ color: "var(--text-secondary)" }}>
            No stories published yet. Mark some posts as &quot;Published&quot; in your Notion database
            to see them here.
          </p>
        </section>
      )}
    </>
  );
}