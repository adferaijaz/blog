// src/components/BlogCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns";
import type { BlogPost } from "@/lib/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-80px" }}
    >
      <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
        {/* Image container with subtle parallax on hover */}
        {post.coverImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-200 dark:bg-gray-800">
            <Image
              src={post.coverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          </div>
        )}

        {/* Category badge */}
        <p className="eyebrow mb-2">{post.category}</p>

        {/* Title */}
        <h3 className="headline text-lg md:text-xl mb-2 group-hover:opacity-70 transition-opacity line-clamp-2">
          {post.title}
        </h3>

        {/* Subheading (excerpt) */}
        <p
          className="text-sm md:text-base mb-4 grow line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {post.subheading}
        </p>

        {/* Author + date + reading time */}
        <p className="text-xs md:text-sm" style={{ color: "var(--text-secondary)" }}>
          {post.authors.map((a) => a.name).join(", ")}
          {post.publishedDate ? ` · ${format(new Date(post.publishedDate), "MMM d, yyyy")}` : ""}
          {post.readingTime ? ` · ${post.readingTime} min read` : ""}
        </p>
      </Link>
    </motion.article>
  );
}