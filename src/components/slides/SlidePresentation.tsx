"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

export interface SlideData {
  id: number;
  content: React.ReactNode;
  background?: string;
}

interface SlidePresentationProps {
  slides: SlideData[];
  className?: string;
}

export default function SlidePresentation({
  slides,
  className,
}: SlidePresentationProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= total) return;
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current, total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  // Touch/swipe support
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    touchStart.current = null;
  };

  // GSAP entrance animation for slide content
  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll("[data-animate]");
    gsap.fromTo(
      elements,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      }
    );
  }, [current]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-[#fafaf9] text-zinc-900 ${className ?? ""}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-zinc-200">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-red-500"
          initial={false}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Slide counter */}
      <div className="fixed top-6 right-8 z-50 font-mono text-sm text-zinc-400">
        <span className="text-orange-600 font-bold">{String(current + 1).padStart(2, "0")}</span>
        <span className="mx-1">/</span>
        <span>{String(total).padStart(2, "0")}</span>
      </div>

      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          ref={containerRef}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.4 },
          }}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: slides[current]?.background ?? "transparent",
          }}
        >
          {slides[current]?.content}
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="slide-nav">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`slide-dot ${i === current ? "active" : ""}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="keyboard-hint">
        <span className="inline-flex items-center gap-2">
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-300 text-zinc-600 text-xs">←</kbd>
          <kbd className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-300 text-zinc-600 text-xs">→</kbd>
          <span className="ml-1">to navigate</span>
        </span>
      </div>

      {/* Click zones for navigation */}
      <button
        onClick={prev}
        className="absolute left-0 top-0 w-1/5 h-full z-40 cursor-w-resize opacity-0 hover:opacity-100 transition-opacity"
        aria-label="Previous slide"
      >
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/5 backdrop-blur flex items-center justify-center border border-black/10">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-0 w-1/5 h-full z-40 cursor-e-resize opacity-0 hover:opacity-100 transition-opacity"
        aria-label="Next slide"
      >
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/5 backdrop-blur flex items-center justify-center border border-black/10">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
    </div>
  );
}
