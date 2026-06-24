// src/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface NavbarProps {
  categories: string[];
}

export default function Navbar({ categories }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on Escape, a small but real accessibility expectation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cycleTheme = () => {
    const next = theme === "auto" ? "light" : theme === "light" ? "dark" : "auto";
    setTheme(next);
  };

  const ThemeIcon = theme === "auto" ? Monitor : theme === "light" ? Sun : Moon;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen ? "glass" : "bg-transparent"
        }`}
      >
        <nav className="max-w-300 mx-auto flex items-center justify-between px-6 h-14">
          <Link
            href="/"
            className="headline text-[17px]"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setMenuOpen(false)}
          >
            The Biscoff Brief
          </Link>

          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((s) => !s)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <Search size={18} style={{ color: "var(--text-primary)" }} />
            </button>

            <button
              aria-label={`Theme: ${theme}. Click to change.`}
              onClick={cycleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title={`Theme: ${theme}`}
            >
              <ThemeIcon size={18} style={{ color: "var(--text-primary)" }} />
            </button>

            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((m) => !m)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {menuOpen ? (
                <X size={20} style={{ color: "var(--text-primary)" }} />
              ) : (
                <Menu size={20} style={{ color: "var(--text-primary)" }} />
              )}
            </button>
          </div>
        </nav>

        {/* Expandable search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden border-t"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <form
                action={`${process.env.NEXT_PUBLIC_BASE_PATH}/search`}
                className="max-w-300 mx-auto px-6 py-4"
              >
                <input
                  type="text"
                  name="q"
                  autoFocus
                  placeholder="Search articles, authors, topics…"
                  className="w-full bg-transparent text-xl outline-none headline"
                  style={{ color: "var(--text-primary)" }}
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Full expandable menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-14 left-0 right-0 z-40 glass border-t"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="max-w-300 mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="eyebrow mb-4">Sections</p>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <Link
                        href={`/category/${encodeURIComponent(cat.toLowerCase())}`}
                        onClick={() => setMenuOpen(false)}
                        className="text-lg headline hover:opacity-60 transition-opacity"
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-4">More</p>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg headline hover:opacity-60 transition-opacity"
                    >
                      Latest
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg headline hover:opacity-60 transition-opacity"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}