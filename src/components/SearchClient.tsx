// src/components/SearchClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Search as SearchIcon } from "lucide-react";
import type { SearchIndexEntry } from "@/lib/search-index";

export default function SearchClient({ index }: { index: SearchIndexEntry[] }) {
  const params = useSearchParams();
  // Initialize query from URL params. Avoid synchronously calling setState inside an effect
  // which can cause cascading renders.
  const [query, setQuery] = useState(() => params.get("q") ?? "");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter((entry) => {
      const haystack = [
        entry.title,
        entry.subheading,
        entry.category,
        ...entry.tags,
        ...entry.authorNames,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, index]);

  return (
    <div className="max-w-200 mx-auto px-6 pt-32 pb-24">
      <div className="flex items-center gap-3 border-b pb-4 mb-10" style={{ borderColor: "var(--border-subtle)" }}>
        <SearchIcon size={24} style={{ color: "var(--text-secondary)" }} />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, authors, topics…"
          className="w-full bg-transparent text-3xl headline outline-none"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      {query.trim() === "" && (
        <p style={{ color: "var(--text-secondary)" }}>
          Start typing to search every published article.
        </p>
      )}

      {query.trim() !== "" && results.length === 0 && (
        <p style={{ color: "var(--text-secondary)" }}>
          No results for &ldquo;{query}&rdquo;. Try a different word.
        </p>
      )}

      <ul className="space-y-8">
        {results.map((r) => (
          <li key={r.slug}>
            <Link href={`/blog/${r.slug}`} className="flex gap-5 group">
              {r.coverImage && (
                <div className="relative w-28 h-20 shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={r.coverImage}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <p className="eyebrow mb-1">{r.category}</p>
                <h3 className="headline text-lg mb-1 group-hover:opacity-70 transition-opacity">
                  {r.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {r.authorNames.join(", ")}
                  {r.publishedDate ? ` · ${format(new Date(r.publishedDate), "MMM d, yyyy")}` : ""}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}