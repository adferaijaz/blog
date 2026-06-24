// src/app/author/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getAuthorBySlug, getAllAuthors, getPostsByAuthor } from "@/lib/notion";
import BlogCard from "@/components/BlogCard";

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Not Found" };

  return {
    title: `${author.name} — The Biscoff Brief`,
    description: author.bio,
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return (
      <div className="max-w-200 mx-auto px-6 py-32 text-center">
        <h1 className="headline text-3xl mb-4">Author not found</h1>
        <Link href="/" className="text-sm headline" style={{ color: "var(--accent)" }}>
          Return home →
        </Link>
      </div>
    );
  }

  const posts = await getPostsByAuthor(slug);

  return (
    <div className="max-w-300 mx-auto px-6 pt-32 pb-24">
      <Link href="/" className="text-sm headline hover:opacity-70 transition-opacity mb-8 block" style={{ color: "var(--accent)" }}>
        ← Back
      </Link>

      {/* Author hero card */}
      <div className="max-w-150 mb-16">
        <div className="flex gap-6 mb-8">
          {author.avatarUrl && (
            <div className="relative w-32 h-32 shrink-0 rounded-2xl overflow-hidden">
              <Image
                src={author.avatarUrl}
                alt={author.name}
                fill
                className="object-cover"
                sizes="128px"
                unoptimized
              />
            </div>
          )}
          <div>
            <h1 className="headline text-4xl mb-1">{author.name}</h1>
            <p className="text-lg mb-4" style={{ color: "var(--text-secondary)" }}>
              {author.role}
            </p>
            <p className="mb-4">{author.bio}</p>
            {(author.twitter || author.website) && (
              <div className="flex gap-4">
                {author.twitter && (
                  <a
                    href={author.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm headline hover:opacity-70 transition-opacity"
                    style={{ color: "var(--accent)" }}
                  >
                    𝕏 →
                  </a>
                )}
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm headline hover:opacity-70 transition-opacity"
                    style={{ color: "var(--accent)" }}
                  >
                    Website →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts by author */}
      {posts.length > 0 && (
        <div>
          <h2 className="headline text-2xl mb-8">
            {posts.length} {posts.length === 1 ? "story" : "stories"} by {author.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <p style={{ color: "var(--text-secondary)" }}>
          No published stories yet.
        </p>
      )}
    </div>
  );
}