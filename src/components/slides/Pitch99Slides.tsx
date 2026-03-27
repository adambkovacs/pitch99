"use client";

import { motion } from "framer-motion";
import { Clock, RefreshCw, Hourglass, TrendingDown } from "lucide-react";
import SlidePresentation, { type SlideData } from "./SlidePresentation";
import MarketChart from "./MarketChart";
import AnimatedCounter from "./AnimatedCounter";

/* ─────────────────────────────────────────
   SLIDE 1 — HOOK
   "99 Problems, but this pitch ain't one"
   ───────────────────────────────────────── */
function SlideHook() {
  return (
    <div className="flex flex-col items-center justify-center px-8 max-w-5xl mx-auto text-center">
      <motion.div data-animate className="relative mb-4">
        <span className="text-[10rem] sm:text-[14rem] font-black leading-none gradient-text tracking-tighter select-none">
          99
        </span>
        <motion.div
          className="absolute -inset-12 rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, rgba(249,115,22,0.08) 50%, transparent 70%)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <h1 data-animate className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight leading-tight text-zinc-900">
        As an entrepreneur, you have
        <br />
        <span className="text-red-600">99 problems.</span>
        <br />
        <span className="gradient-text">But this pitch ain&apos;t one.</span>
      </h1>

      <p data-animate className="text-base sm:text-lg text-zinc-600 max-w-xl leading-relaxed">
        Meet <strong className="text-zinc-900">Pitch99</strong> — AI that turns your product into a
        stunning 99-second pitch. Research, slides, talking points.
        Done in minutes.
      </p>

      <motion.div
        data-animate
        className="mt-10 flex items-center gap-3"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-xs text-zinc-500 tracking-wide">
          BUILT LIVE • FOUNDERS LIVE SEATTLE • 2026
        </span>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SLIDE 2 — THE PROBLEM
   ───────────────────────────────────────── */
function SlideProblem() {
  const stats = [
    { icon: <Clock className="w-6 h-6 text-red-500" />, value: "40+", unit: "hours", label: "spent building pitch decks", color: "from-red-500/20 to-transparent" },
    { icon: <RefreshCw className="w-6 h-6 text-amber-600" />, value: "40", unit: "pitches", label: "needed to close a round", color: "from-amber-500/20 to-transparent" },
    { icon: <Hourglass className="w-6 h-6 text-orange-600" />, value: "2:24", unit: "min", label: "investors spend reviewing", color: "from-orange-500/20 to-transparent" },
    { icon: <TrendingDown className="w-6 h-6 text-rose-500" />, value: "97%", unit: "", label: "of pitches fail to get funded", color: "from-rose-500/20 to-transparent" },
  ];

  return (
    <div className="flex flex-col items-center justify-center px-8 max-w-5xl mx-auto">
      <div data-animate className="text-xs font-mono text-orange-600 uppercase tracking-[0.2em] mb-3">
        The Problem
      </div>
      <h2 data-animate className="text-3xl sm:text-4xl font-bold mb-3 text-center leading-tight">
        The Pitch Paradox
      </h2>
      <p data-animate className="text-zinc-500 text-center mb-10 max-w-lg text-sm leading-relaxed">
        Founders pour weeks into decks that investors skim in seconds.
        Every audience needs a different pitch. Every time.
      </p>

      <div className="grid grid-cols-2 gap-5 w-full max-w-2xl">
        {stats.map((stat) => (
          <div
            key={stat.label}
            data-animate
            className="rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-sm relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-30`} />
            <div className="relative">
              <span className="mb-2 block">{stat.icon}</span>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-2xl sm:text-3xl font-black text-zinc-900 font-mono">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-xs text-zinc-500 font-mono">{stat.unit}</span>
                )}
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SLIDE 3 — THE SOLUTION
   ───────────────────────────────────────── */
function SlideSolution() {
  const steps = [
    { num: "01", title: "Intake", desc: "GitHub, website, LinkedIn, uploads", gradient: "from-orange-500 to-orange-600" },
    { num: "02", title: "Research", desc: "Market, competitors, TAM/SAM", gradient: "from-red-500 to-red-600" },
    { num: "03", title: "Generate", desc: "Slides, animations, talking points", gradient: "from-rose-500 to-pink-600" },
    { num: "04", title: "Present", desc: "99 seconds. Q&A prep included.", gradient: "from-teal-500 to-teal-600" },
  ];

  return (
    <div className="flex flex-col items-center justify-center px-8 max-w-5xl mx-auto">
      <div data-animate className="text-xs font-mono text-orange-600 uppercase tracking-[0.2em] mb-3">
        The Solution
      </div>
      <h2 data-animate className="text-3xl sm:text-4xl font-bold mb-3 text-center leading-tight">
        From repo to pitch in <span className="gradient-text">minutes</span>
      </h2>
      <p data-animate className="text-zinc-500 text-center mb-10 max-w-lg text-sm leading-relaxed">
        Pitch99 ingests your product, enriches with market research,
        and crafts a presentation you&apos;re proud to deliver.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
        {steps.map((step, i) => (
          <div key={step.num} className="flex-1 relative" data-animate>
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-sm text-center h-full">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${step.gradient} mb-3`}>
                <span className="text-sm font-bold text-white">{step.num}</span>
              </div>
              <h3 className="font-semibold text-base mb-1 text-zinc-900">{step.title}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">{step.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden sm:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3L9 7L5 11" stroke="rgba(251,146,60,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SLIDE 4 — MARKET OPPORTUNITY
   ───────────────────────────────────────── */
function SlideMarket() {
  const marketData = [
    { label: "Presentation SW (2025)", value: 8.2, color: "linear-gradient(90deg, #f97316, #fb923c)" },
    { label: "AI Pres. Tools (2025)", value: 2.0, color: "linear-gradient(90deg, #ef4444, #f87171)" },
    { label: "AI Pres. Tools (2033)", value: 10.0, color: "linear-gradient(90deg, #dc2626, #f87171)" },
    { label: "Presentation SW (2030)", value: 16.6, color: "linear-gradient(90deg, #0d9488, #2dd4bf)" },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center px-8 max-w-6xl mx-auto gap-12 lg:gap-16">
      <div className="flex-1 max-w-md">
        <div data-animate className="text-xs font-mono text-orange-600 uppercase tracking-[0.2em] mb-3">
          Market Opportunity
        </div>
        <h2 data-animate className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">
          <AnimatedCounter to={16.6} prefix="$" suffix="B" decimals={1} delay={0.3} duration={2.5} className="gradient-text font-black text-4xl sm:text-5xl" />
        </h2>
        <p data-animate className="text-sm text-zinc-500 mb-8">
          presentation market by 2030, growing at <span className="text-orange-600 font-semibold">25% CAGR</span> for AI tools
        </p>

        <div data-animate className="space-y-3">
          {[
            { num: "5.1M", text: "startups founded per year globally" },
            { num: "1.6M", text: "accelerator applications annually" },
            { num: "40", text: "pitches avg. to close a funding round" },
            { num: "<3%", text: "of pitches succeed — preparation is everything" },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3 text-sm">
              <span className="font-mono font-bold text-orange-600 min-w-[4rem] text-right">{item.num}</span>
              <span className="text-zinc-500">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full max-w-md" data-animate>
        <MarketChart data={marketData} title="Market Size ($B)" suffix="B" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SLIDE 5 — CTA / CLOSING
   ───────────────────────────────────────── */
function SlideCTA() {
  return (
    <div className="flex flex-col items-center justify-center px-8 max-w-4xl mx-auto text-center gap-0">
      {/* Logo */}
      <motion.div data-animate className="relative mb-10">
        <span className="text-7xl sm:text-9xl font-black gradient-text tracking-tight">
          pitch99
        </span>
        <motion.div
          className="absolute -inset-12 rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, rgba(249,115,22,0.06) 50%, transparent 70%)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Headline */}
      <h2 data-animate className="text-2xl sm:text-4xl font-bold mb-6 leading-tight text-zinc-900">
        You have <span className="text-red-600">99 problems</span>.
        <br />
        <span className="gradient-text">Your pitch isn&apos;t one anymore.</span>
      </h2>

      {/* Subtext */}
      <p data-animate className="text-zinc-600 mb-12 max-w-lg text-base sm:text-lg leading-relaxed">
        Stop spending weeks on decks. Let AI research your market,
        craft your story, and generate slides that move people.
      </p>

      {/* Buttons — generous spacing */}
      <motion.div data-animate className="flex flex-col sm:flex-row gap-5 items-center mb-16">
        <a
          href="/intake"
          className="px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-base hover:from-orange-400 hover:to-red-400 transition-all shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.04] active:scale-[0.97]"
        >
          Create Your Pitch
        </a>
        <a
          href="https://github.com/adambkovacs/pitch99"
          target="_blank"
          rel="noopener noreferrer"
          className="px-10 py-4 rounded-full border-2 border-zinc-300 text-zinc-700 text-base font-semibold hover:border-orange-500 hover:bg-white/5 transition-all"
        >
          View on GitHub
        </a>
      </motion.div>

      {/* Tech stack — well-separated from buttons */}
      <div data-animate className="flex items-center gap-6 text-xs text-zinc-400 font-mono uppercase tracking-[0.15em]">
        <span>Next.js</span>
        <span className="w-1 h-1 rounded-full bg-zinc-300" />
        <span>OpenRouter</span>
        <span className="w-1 h-1 rounded-full bg-zinc-300" />
        <span>Convex</span>
        <span className="w-1 h-1 rounded-full bg-zinc-300" />
        <span>GSAP</span>
        <span className="w-1 h-1 rounded-full bg-zinc-300" />
        <span>Vercel</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SLIDE ASSEMBLY
   ───────────────────────────────────────── */
const slides: SlideData[] = [
  {
    id: 0,
    content: <SlideHook />,
    background: "radial-gradient(ellipse at 50% 20%, rgba(251,146,60,0.10) 0%, rgba(249,115,22,0.06) 40%, transparent 70%)",
  },
  {
    id: 1,
    content: <SlideProblem />,
    background: "radial-gradient(ellipse at 30% 70%, rgba(239,68,68,0.08) 0%, transparent 60%)",
  },
  {
    id: 2,
    content: <SlideSolution />,
    background: "radial-gradient(ellipse at 70% 30%, rgba(251,146,60,0.09) 0%, rgba(239,68,68,0.06) 40%, transparent 70%)",
  },
  {
    id: 3,
    content: <SlideMarket />,
    background: "radial-gradient(ellipse at 40% 50%, rgba(251,146,60,0.09) 0%, rgba(249,115,22,0.06) 40%, transparent 70%)",
  },
  {
    id: 4,
    content: <SlideCTA />,
    background: "radial-gradient(ellipse at 50% 30%, rgba(251,146,60,0.12) 0%, rgba(249,115,22,0.06) 40%, transparent 70%)",
  },
];

export default function Pitch99Slides() {
  return <SlidePresentation slides={slides} />;
}
