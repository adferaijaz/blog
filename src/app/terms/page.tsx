// src/app/terms/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Terms of Use — The Biscoff Brief",
};

export default function TermsPage() {
  return (
    <article className="max-w-200 mx-auto px-6 pt-32 pb-24">
      <Link href="/" className="text-sm headline hover:opacity-70 transition-opacity mb-8 block" style={{ color: "var(--accent)" }}>
        ← Back
      </Link>

      <h1 className="headline text-5xl md:text-6xl mb-8">Terms of Use</h1>

      <div className="space-y-6 text-lg opacity-90">
        <p>
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <h2 className="headline text-2xl mt-10 mb-4">Acceptance of Terms</h2>
        <p>
          By accessing and using The Biscoff Brief, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 className="headline text-2xl mt-10 mb-4">Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on The Biscoff Brief for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul style={{ paddingLeft: "1.5rem", listStyle: "disc" }}>
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to decompile or reverse engineer any software contained on the site</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
        </ul>

        <h2 className="headline text-2xl mt-10 mb-4">Disclaimer</h2>
        <p>
          The materials on The Biscoff Brief are provided on an &quot;as is&quot; basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2 className="headline text-2xl mt-10 mb-4">Limitations</h2>
        <p>
          In no event shall The Biscoff Brief or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The Biscoff Brief.
        </p>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "2rem" }}>
          Note: This is a template. Customize this page with your actual terms and ensure legal compliance.
        </p>
      </div>
    </article>
  );
}