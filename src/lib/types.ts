// src/lib/types.ts

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatarUrl: string | null;
  role: string;
  twitter?: string;
  website?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  subheading: string;
  authors: Author[];
  category: string;
  tags: string[];
  coverImage: string | null;
  videoUrl?: string;
  publishedDate: string; // ISO string
  status: "Draft" | "Ready" | "Published";
  featured: boolean;
  readingTime: number;
}

export interface BlogPostWithContent extends BlogPost {
  contentMarkdown: string;
}