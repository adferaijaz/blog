// src/lib/search-index.ts
//
// Produces a small, lightweight index for client-side search.
// This intentionally excludes full article bodies — only what's needed
// to find and link to a post — so the JSON shipped to the browser stays tiny
// even with hundreds of posts.

import { getAllPublishedPosts } from "./notion";

export interface SearchIndexEntry {
  title: string;
  subheading: string;
  slug: string;
  category: string;
  tags: string[];
  authorNames: string[];
  coverImage: string | null;
  publishedDate: string;
}

export async function buildSearchIndex(): Promise<SearchIndexEntry[]> {
  const posts = await getAllPublishedPosts();
  return posts.map((p) => ({
    title: p.title,
    subheading: p.subheading,
    slug: p.slug,
    category: p.category,
    tags: p.tags,
    authorNames: p.authors.map((a) => a.name),
    coverImage: p.coverImage,
    publishedDate: p.publishedDate,
  }));
}