// src/app/blog/[slug]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { format } from "date-fns";
import { getPostBySlug, getAllPostSlugs } from "@/lib/notion";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} — The Biscoff Brief`,
    description: post.subheading,
    openGraph: {
      title: post.title,
      description: post.subheading,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="max-w-200 mx-auto px-6 py-32 text-center">
        <h1 className="headline text-3xl mb-4">Article not found</h1>
        <p style={{ color: "var(--text-secondary)" }} className="mb-6">
          This story has been removed or never existed.
        </p>
        <Link href="/" className="text-sm headline" style={{ color: "var(--accent)" }}>
          Return home →
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero image */}
      {post.coverImage && (
        <div className="w-full h-100 md:h-130 relative overflow-hidden">
          <Image
            src={post.coverImage}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* Article content */}
      <article className="max-w-200 mx-auto px-6 py-16 md:py-24">
        {/* Metadata */}
        <div className="mb-8 pb-8 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <p className="eyebrow mb-3">{post.category}</p>
          <h1 className="headline text-4xl md:text-5xl mb-6">{post.title}</h1>
          <p className="text-lg mb-6" style={{ color: "var(--text-secondary)" }}>
            {post.subheading}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            <div>
              {post.authors.map((a, i) => (
                <span key={a.id}>
                  <Link href={`/author/${a.slug}`} className="hover:opacity-70 transition-opacity font-medium">
                    {a.name}
                  </Link>
                  {i < post.authors.length - 1 && ", "}
                </span>
              ))}
            </div>
            {post.publishedDate && <time>{format(new Date(post.publishedDate), "MMMM d, yyyy")}</time>}
            {post.readingTime && <span>{post.readingTime} min read</span>}
          </div>
        </div>

        {/* Body content rendered from Markdown */}
        <div style={{ color: "var(--text-primary)" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              p: ({ children }) => (
                <p className="text-lg leading-relaxed mb-6 opacity-90">{children}</p>
              ),
              h2: ({ children }) => (
                <h2 className="headline text-3xl mt-12 mb-6 first:mt-0">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="headline text-2xl mt-10 mb-4">{children}</h3>
              ),
              a: ({ href, children }) => (
                <a href={href} style={{ color: "var(--accent)" }} className="hover:opacity-80 transition-opacity">
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote
                  className="border-l-4 px-6 py-4 my-8 italic opacity-80"
                  style={{ borderColor: "var(--accent)", background: "var(--bg-secondary)" }}
                >
                  {children}
                </blockquote>
              ),
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt || ""}
                  style={{ maxWidth: "100%", height: "auto", marginTop: "2.5rem", marginBottom: "2.5rem", borderRadius: "0.5rem" }}
                />
              ),
            }}
          >
            {post.contentMarkdown}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            <p className="eyebrow mb-4">Tags</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                  className="px-4 py-2 rounded-full text-sm headline transition-opacity hover:opacity-70"
                  style={{ background: "var(--bg-secondary)" }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author bios */}
        {post.authors.length > 0 && (
          <div className="mt-12 pt-8 border-t space-y-8" style={{ borderColor: "var(--border-subtle)" }}>
            <p className="eyebrow">About the author{post.authors.length > 1 ? "s" : ""}</p>
            {post.authors.map((author) => (
              <div key={author.id} className="flex gap-4">
                {author.avatarUrl && (
                  <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden">
                    <Image
                      src={author.avatarUrl}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <Link
                    href={`/author/${author.slug}`}
                    className="headline text-lg hover:opacity-70 transition-opacity"
                  >
                    {author.name}
                  </Link>
                  <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                    {author.role}
                  </p>
                  <p className="text-sm opacity-90">{author.bio}</p>
                  {(author.twitter || author.website) && (
                    <div className="flex gap-3 mt-3">
                      {author.twitter && (
                        <a
                          href={author.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs headline hover:opacity-70 transition-opacity"
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
                          className="text-xs headline hover:opacity-70 transition-opacity"
                          style={{ color: "var(--accent)" }}
                        >
                          Website →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </>
  );
}