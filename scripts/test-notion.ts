// scripts/test-notion.ts
//
// Run with: npx tsx scripts/test-notion.ts
// Verifies lib/notion.ts can reach Notion and the shape of data is correct
// BEFORE we wire it into any React component.

import { getAllPublishedPosts, getAllAuthors, getPostBySlug } from "../src/lib/notion";

async function main() {
  console.log("\n=== 1. Fetching all authors ===");
  const authors = await getAllAuthors();
  console.log(`Found ${authors.length} author(s):`);
  authors.forEach((a) =>
    console.log(`  - ${a.name} (@${a.slug}) — ${a.role || "no role set"}`)
  );

  console.log("\n=== 2. Fetching all published posts ===");
  const posts = await getAllPublishedPosts();
  console.log(`Found ${posts.length} published post(s):`);
  posts.forEach((p) => {
    const authorNames = p.authors.map((a) => a.name).join(", ") || "NO AUTHOR LINKED";
    console.log(`  - "${p.title}"`);
    console.log(`      slug: ${p.slug || "MISSING SLUG"}`);
    console.log(`      authors: ${authorNames}`);
    console.log(`      category: ${p.category || "MISSING"} | tags: ${p.tags.join(", ") || "none"}`);
    console.log(`      cover image: ${p.coverImage ? "OK" : "MISSING"}`);
    console.log(`      featured: ${p.featured} | readingTime: ${p.readingTime}`);
  });

  if (posts.length === 0) {
    console.log("\n⚠️  No published posts found. Check that Status = 'Published' on at least one post.");
    return;
  }

  console.log("\n=== 3. Fetching full content for first post ===");
  const firstSlug = posts[0].slug;
  if (!firstSlug) {
    console.log("⚠️  First post has no slug set — cannot test getPostBySlug. Add a slug and re-run.");
    return;
  }

  const fullPost = await getPostBySlug(firstSlug);
  if (!fullPost) {
    console.log(`⚠️  getPostBySlug("${firstSlug}") returned null — slug mismatch?`);
    return;
  }

  console.log(`Title: ${fullPost.title}`);
  console.log(`Markdown content length: ${fullPost.contentMarkdown.length} characters`);
  console.log("First 300 characters of body:\n");
  console.log(fullPost.contentMarkdown.slice(0, 300));

  console.log("\n✅ All checks ran. Review the output above for any MISSING fields.\n");
}

main().catch((err) => {
  console.error("\n❌ Script failed with error:\n");
  console.error(err);
  process.exit(1);
});