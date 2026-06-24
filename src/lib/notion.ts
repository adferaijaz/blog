// src/lib/notion.ts

import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import type { Author, BlogPost, BlogPostWithContent } from "./types";

// ---- Client setup ----

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: "2025-09-03",
});

const n2m = new NotionToMarkdown({ notionClient: notion });

const BLOG_DB_ID = process.env.NOTION_BLOG_DB_ID!;
const AUTHORS_DB_ID = process.env.NOTION_AUTHORS_DB_ID!;

// ---- Data source resolution ----
//
// As of Notion API version 2025-09-03, a "database" is a container that can
// hold multiple "data sources" (the actual queryable table of rows).
// Querying now happens against a data_source_id, not the database_id directly.
// For ordinary single-table databases (our case) there's exactly one data
// source per database — we just need to resolve and cache its ID once.

const dataSourceIdCache = new Map<string, string>();

async function resolveDataSourceId(databaseId: string): Promise<string> {
  const cached = dataSourceIdCache.get(databaseId);
  if (cached) return cached;

  const db = await notion.databases.retrieve({ database_id: databaseId });
  const dataSourceId = (db as any).data_sources?.[0]?.id;

  if (!dataSourceId) {
    throw new Error(
      `Could not resolve a data source for database ${databaseId}. ` +
        `Check the database still exists and the integration has access.`
    );
  }

  dataSourceIdCache.set(databaseId, dataSourceId);
  return dataSourceId;
}

// ---- Helper: safely extract values from Notion's verbose property objects ----

function getTitle(prop: any): string {
  return prop?.title?.[0]?.plain_text ?? "";
}

function getRichText(prop: any): string {
  return prop?.rich_text?.map((t: any) => t.plain_text).join("") ?? "";
}

function getSelect(prop: any): string {
  return prop?.select?.name ?? "";
}

function getMultiSelect(prop: any): string[] {
  return prop?.multi_select?.map((t: any) => t.name) ?? [];
}

function getCheckbox(prop: any): boolean {
  return prop?.checkbox ?? false;
}

function getNumber(prop: any): number {
  return prop?.number ?? 0;
}

function getDate(prop: any): string {
  return prop?.date?.start ?? "";
}

function getUrl(prop: any): string {
  return prop?.url ?? "";
}

function getFileUrl(prop: any): string | null {
  const file = prop?.files?.[0];
  if (!file) return null;
  // Notion files are either uploaded ("file") or external links ("external")
  return file.type === "external" ? file.external.url : file.file.url;
}

function getRelationIds(prop: any): string[] {
  return prop?.relation?.map((r: any) => r.id) ?? [];
}

// ---- Authors ----

let authorsCache: Map<string, Author> | null = null;

/**
 * Fetches ALL authors once and caches them by page ID.
 * Called internally so blog posts can resolve their Authors relation
 * without firing a separate API request per post per author.
 */
async function getAuthorsMap(): Promise<Map<string, Author>> {
  if (authorsCache) return authorsCache;

  const map = new Map<string, Author>();
  let cursor: string | undefined = undefined;
  const dataSourceId = await resolveDataSourceId(AUTHORS_DB_ID);

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
    });

    for (const page of response.results as any[]) {
      const props = page.properties;
      const author: Author = {
        id: page.id,
        name: getTitle(props["Name"]),
        slug: getRichText(props["Slug"]),
        bio: getRichText(props["Bio"]),
        avatarUrl: getFileUrl(props["Avatar"]),
        role: getRichText(props["Role"]),
        twitter: getUrl(props["𝕏"]) || undefined,
        website: getUrl(props["Website"]) || undefined,
      };
      map.set(page.id, author);
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  authorsCache = map;
  return map;
}

export async function getAllAuthors(): Promise<Author[]> {
  const map = await getAuthorsMap();
  return Array.from(map.values());
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const authors = await getAllAuthors();
  return authors.find((a) => a.slug === slug) ?? null;
}

// ---- Blog Posts ----

function mapPageToPost(page: any, authorsMap: Map<string, Author>): BlogPost {
  const props = page.properties;

  const authorIds = getRelationIds(props["Authors"]);
  const authors = authorIds
    .map((id) => authorsMap.get(id))
    .filter((a): a is Author => Boolean(a));

  return {
    id: page.id,
    title: getTitle(props["Title"]),
    slug: getRichText(props["Slug"]),
    subheading: getRichText(props["Subheading"]),
    authors,
    category: getSelect(props["Category"]),
    tags: getMultiSelect(props["Tags"]),
    coverImage: getFileUrl(props["Cover Image"]),
    videoUrl: getUrl(props["Video URL"]) || undefined,
    publishedDate: getDate(props["Published Date"]),
    status: (getSelect(props["Status"]) || "Draft") as BlogPost["status"],
    featured: getCheckbox(props["Featured"]),
    readingTime: getNumber(props["Reading Time"]),
  };
}

/**
 * Fetches all PUBLISHED posts, sorted newest first.
 * This is the main function the homepage and archive pages use.
 */
export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  const authorsMap = await getAuthorsMap();
  const posts: BlogPost[] = [];
  let cursor: string | undefined = undefined;
  const dataSourceId = await resolveDataSourceId(BLOG_DB_ID);

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
      sorts: [{ property: "Published Date", direction: "descending" }],
      start_cursor: cursor,
    });

    for (const page of response.results as any[]) {
      posts.push(mapPageToPost(page, authorsMap));
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return posts;
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const all = await getAllPublishedPosts();
  return all.filter((p) => p.featured);
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const all = await getAllPublishedPosts();
  return all.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const all = await getAllPublishedPosts();
  return all.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
}

export async function getPostsByAuthor(authorSlug: string): Promise<BlogPost[]> {
  const all = await getAllPublishedPosts();
  return all.filter((p) => p.authors.some((a) => a.slug === authorSlug));
}

/**
 * Fetches a single post by slug, INCLUDING its full body content
 * converted to Markdown. Used by the individual blog post page.
 * Returns null if no published post matches the slug.
 */
export async function getPostBySlug(slug: string): Promise<BlogPostWithContent | null> {
  const authorsMap = await getAuthorsMap();
  const dataSourceId = await resolveDataSourceId(BLOG_DB_ID);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        { property: "Slug", rich_text: { equals: slug } },
        { property: "Status", select: { equals: "Published" } },
      ],
    },
  });

  const page = response.results[0] as any;
  if (!page) return null;

  const post = mapPageToPost(page, authorsMap);
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const { parent: contentMarkdown } = n2m.toMarkdownString(mdBlocks);

  return { ...post, contentMarkdown };
}

/** Returns every published slug — used by generateStaticParams for static export. */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPublishedPosts();
  return posts.map((p) => p.slug).filter(Boolean);
}