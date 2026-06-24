// src/components/Hero.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { BlogPost } from "@/lib/types";

const AUTO_ADVANCE_MS = 6000;

export default function Hero({ posts }: { posts: BlogPost[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = posts.slice(0, 5);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(next, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next, slides.length]);

  if (slides.length === 0) return null;

  const current = slides[index];

  return (
    <section
      className="relative w-full h-[88vh] min-h-[560px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured stories"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {current.coverImage && (
            <Image
              src={current.coverImage}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
              unoptimized
            />
          )}
          {/* Gradient for legible text over any image, light or dark */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.75) 100%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full flex flex-col justify-end max-w-[1200px] mx-auto px-6 pb-20 md:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "-text"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
          >
            <p className="eyebrow mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>
              {current.category}
            </p>
            <Link href={`/blog/${current.slug}`} className="group">
              <h1
                className="headline text-white text-4xl md:text-6xl mb-4 max-w-[820px] group-hover:opacity-90 transition-opacity"
              >
                {current.title}
              </h1>
            </Link>
            <p className="text-white/80 text-lg max-w-[640px] mb-5 hidden md:block">
              {current.subheading}
            </p>
            <p className="text-white/60 text-sm">
              {current.authors.map((a) => a.name).join(", ")}
              {current.publishedDate
                ? ` · ${format(new Date(current.publishedDate), "MMM d, yyyy")}`
                : ""}
              {current.readingTime ? ` · ${current.readingTime} min read` : ""}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-10">
          <button
            aria-label="Previous story"
            onClick={prev}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Go to story ${i + 1}`}
                onClick={() => goTo(i)}
                className="relative h-1.5 rounded-full overflow-hidden bg-white/25 transition-all"
                style={{ width: i === index ? 32 : 16 }}
              >
                {i === index && !paused && (
                  <motion.div
                    key={current.id + "-progress"}
                    className="absolute inset-0 bg-white rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                    style={{ transformOrigin: "left" }}
                  />
                )}
                {i === index && paused && (
                  <div className="absolute inset-0 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
          <button
            aria-label="Next story"
            onClick={next}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}