// src/app/search/page.tsx
import { Suspense } from "react";
import { buildSearchIndex } from "@/lib/search-index";
import SearchClient from "@/components/SearchClient";

export const metadata = {
  title: "Search — The Biscoff Brief",
};

export default async function SearchPage() {
  const index = await buildSearchIndex();

  return (
    <Suspense fallback={null}>
      <SearchClient index={index} />
    </Suspense>
  );
}