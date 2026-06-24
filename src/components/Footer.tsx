// src/components/Footer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
// Simple inline SVG icon components to avoid dependency/type issues with lucide-react
import React from "react";

const IconWrapper = ({
  size = 16,
  children,
  className,
  style,
  ...rest
}: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    {children}
  </svg>
);

export const Twitter = (props: React.ComponentPropsWithoutRef<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <path d="M22 5.92c-.65.29-1.35.48-2.08.57.75-.45 1.33-1.17 1.6-2.03-.7.42-1.48.73-2.31.9C18.7 4.07 17.6 3.5 16.36 3.5c-1.86 0-3.37 1.5-3.37 3.35 0 .26.03.52.08.77-2.8-.14-5.29-1.48-6.95-3.53-.29.5-.45 1.08-.45 1.7 0 1.17.6 2.2 1.52 2.8-.56-.02-1.09-.17-1.55-.43v.04c0 1.64 1.16 3.01 2.7 3.32-.28.08-.57.12-.87.12-.21 0-.41-.02-.61-.06.41 1.28 1.6 2.21 3.01 2.24-1.1.86-2.49 1.37-4.01 1.37-.26 0-.52-.02-.77-.05 1.43.92 3.12 1.46 4.94 1.46 5.92 0 9.16-4.9 9.16-9.16v-.42c.63-.45 1.18-1.02 1.62-1.66-.58.26-1.2.44-1.84.52.66-.4 1.16-1.03 1.4-1.78z" fill="currentColor"/>
  </IconWrapper>
);

export const Instagram = (props: React.ComponentPropsWithoutRef<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="18.5" cy="5.5" r="0.5" fill="currentColor" />
  </IconWrapper>
);

export const Linkedin = (props: React.ComponentPropsWithoutRef<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 10.5v6M7 8.5v.01M11 17v-4c0-1.1.9-2 2-2s2 .9 2 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </IconWrapper>
);

export const Youtube = (props: React.ComponentPropsWithoutRef<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <path d="M22 7.5s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C15.8 4 12 4 12 4s-3.8 0-6.9.2c-.4 0-1.3.1-2.1 1C2.2 5.9 2 7.5 2 7.5S2 9.4 2 11.3v1.4c0 1.9 0 3.8 0 3.8s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.8.2 7.8.2s3.8 0 6.9-.2c.4 0 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s0-1.9 0-3.8v-1.4c0-1.9 0-3.8 0-3.8z" fill="currentColor"/>
    <path d="M10 14l4-2-4-2v4z" fill="#fff"/>
  </IconWrapper>
);

export const ArrowRight = (props: React.ComponentPropsWithoutRef<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <path d="M5 12h14M13 5l6 7-6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </IconWrapper>
);

export const Check = (props: React.ComponentPropsWithoutRef<typeof IconWrapper>) => (
  <IconWrapper {...props}>
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </IconWrapper>
);

interface FooterProps {
  categories: string[];
}

export default function Footer({ categories }: FooterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Wire this up to your email provider (Mailchimp, Buttondown, etc.)
    // Example for Buttondown:
    // await fetch("https://api.buttondown.email/v1/subscribers", {
    //   method: "POST",
    //   headers: { Authorization: `Token YOUR_API_KEY` },
    //   body: JSON.stringify({ email }),
    // });
    console.log("Newsletter signup (not yet connected to a provider):", email);
    setSubmitted(true);
  };

  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t mt-32"
      style={{ borderColor: "var(--border-subtle)", background: "var(--bg-secondary)" }}
    >
      {/* Newsletter band */}
      <div className="max-w-300 mx-auto px-6 py-20 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-3">Stay in the loop</p>
            <h2 className="headline text-3xl md:text-4xl max-w-120">
              One email a week. Every story worth your time.
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="w-full md:w-auto md:min-w-95">
            {submitted ? (
              <div
                className="flex items-center gap-2 px-5 py-4 rounded-full text-sm"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
              >
                <Check size={16} style={{ color: "var(--accent)" }} />
                You&rsquo;re in. Welcome to The Biscoff Brief.
              </div>
            ) : (
              <div
                className="flex items-center rounded-full pr-1.5 pl-5 py-1.5"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent outline-none text-sm py-2"
                  style={{ color: "var(--text-primary)" }}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-transform hover:scale-105"
                  style={{ background: "var(--accent)" }}
                >
                  <ArrowRight size={16} className="text-white" />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="max-w-300 mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <p className="eyebrow mb-4">Sections</p>
          <ul className="space-y-2.5">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/category/${encodeURIComponent(cat.toLowerCase())}`}
                  className="text-sm hover:opacity-70 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">The Brief</p>
          <ul className="space-y-2.5">
            <li>
              <Link href="/about" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "var(--text-secondary)" }}>
                About us
              </Link>
            </li>
            <li>
              <Link href="/" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "var(--text-secondary)" }}>
                Latest stories
              </Link>
            </li>
            <li>
              <Link href="/search" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "var(--text-secondary)" }}>
                Search
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Legal</p>
          <ul className="space-y-2.5">
            <li>
              <Link href="/privacy" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "var(--text-secondary)" }}>
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "var(--text-secondary)" }}>
                Terms of use
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Follow</p>
          <div className="flex gap-3">
            <a
              href="https://x.com/biscoffbrief"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}
            >
              <Twitter size={16} style={{ color: "var(--text-primary)" }} />
            </a>
            <a
              href="https://instagram.com/biscoffbrief"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}
            >
              <Instagram size={16} style={{ color: "var(--text-primary)" }} />
            </a>
            <a
              href="https://linkedin.com/company/biscoffbrief"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}
            >
              <Linkedin size={16} style={{ color: "var(--text-primary)" }} />
            </a>
            <a
              href="https://youtube.com/@biscoffbrief"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}
            >
              <Youtube size={16} style={{ color: "var(--text-primary)" }} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-300 mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-2 border-t text-xs"
        style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
      >
        <p>© {year} The Biscoff Brief. All rights reserved.</p>
        <p>Crumbled, not stirred.</p>
      </div>
    </footer>
  );
}