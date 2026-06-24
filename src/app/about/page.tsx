// src/app/about/page.tsx
import Link from "next/link";

export const metadata = {
  title: "About — The Biscoff Brief",
};

export default function AboutPage() {
  return (
    <article className="max-w-200 mx-auto px-6 pt-32 pb-24">
      <Link href="/" className="text-sm headline hover:opacity-70 transition-opacity mb-8 block" style={{ color: "var(--accent)" }}>
        ← Back
      </Link>

      <h1 className="headline text-5xl md:text-6xl mb-8">About The Biscoff Brief</h1>

      <div className="space-y-6 text-lg opacity-90">
        <p>
          The Biscoff Brief is a curated publication exploring ideas at the intersection of culture, technology, and human experience. We believe that great stories deserve a thoughtful home.
        </p>

        <p>
          Founded with a simple mission — to bring clarity and nuance to conversations that matter — we publish stories that inform, inspire, and occasionally challenge assumptions.
        </p>

        <h2 className="headline text-3xl mt-12 mb-4">Our writers</h2>
        <p>
          Our contributors bring expertise across fields: from technologists and designers to writers, researchers, and thinkers. Each brings their own voice and perspective.
        </p>

        <h2 className="headline text-3xl mt-12 mb-4">Get in touch</h2>
        <p>
          Have a story idea? Want to write for us? Spotted an error? <a href="mailto:hello@biscoffbrief.com" style={{ color: "var(--accent)" }} className="hover:opacity-70 transition-opacity">Email us.</a>
        </p>
      </div>
    </article>
  );
}