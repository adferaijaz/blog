// src/app/privacy/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — The Biscoff Brief",
};

export default function PrivacyPage() {
  return (
    <article className="max-w-200 mx-auto px-6 pt-32 pb-24">
      <Link href="/" className="text-sm headline hover:opacity-70 transition-opacity mb-8 block" style={{ color: "var(--accent)" }}>
        ← Back
      </Link>

      <h1 className="headline text-5xl md:text-6xl mb-8">Privacy Policy</h1>

      <div className="space-y-6 text-lg opacity-90">
        <p>
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <h2 className="headline text-2xl mt-10 mb-4">Information We Collect</h2>
        <p>
          When you subscribe to our newsletter, we collect your email address. This information is used solely to send you our publication and is never shared with third parties.
        </p>

        <h2 className="headline text-2xl mt-10 mb-4">Your Rights</h2>
        <p>
          You can unsubscribe from our newsletter at any time. You can also request that we delete your data by contacting us directly.
        </p>

        <h2 className="headline text-2xl mt-10 mb-4">Contact Us</h2>
        <p>
          If you have questions about this privacy policy, please <a href="mailto:hello@biscoffbrief.com" style={{ color: "var(--accent)" }} className="hover:opacity-70 transition-opacity">contact us.</a>
        </p>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "2rem" }}>
          Note: This is a template. Customize this page with your actual privacy practices and ensure compliance with GDPR, CCPA, and other applicable regulations.
        </p>
      </div>
    </article>
  );
}