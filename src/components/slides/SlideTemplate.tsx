"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

/* ── Design tokens ──────────────────────── */

const tokens = {
  bg: "#fafaf9",
  text: "#1c1917",
  muted: "#57534e",
  accent: "#f97316",
  card: { bg: "#ffffff", border: "#d6d3d1" },
} as const;

/* ── Types ──────────────────────────────── */

export type SlideVariant = "title" | "content" | "stats" | "chart" | "cta";

export interface StatItem {
  icon: ReactNode;
  value: string;
  unit?: string;
  label: string;
  gradientFrom: string;
}

export interface StepItem {
  num: string;
  title: string;
  desc: string;
  gradient: string;
}

export interface MetricItem {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

export interface CTAAction {
  label: string;
  href: string;
}

/** Shape of a single slide in a generated pitch configuration. */
export interface SlideConfig {
  id: number;
  variant: SlideVariant;
  background?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  stats?: StatItem[];
  steps?: StepItem[];
  metrics?: MetricItem[];
  cta?: {
    headline: string;
    subtext: string;
    primaryAction: CTAAction;
    secondaryAction?: CTAAction;
    techStack?: string[];
  };
  children?: ReactNode;
}

/** Complete generated pitch configuration. */
export interface GeneratedPitchConfig {
  companyName: string;
  generatedAt: string;
  slides: SlideConfig[];
}

export type { GeneratedPitchConfig as generateSlideConfig };

/* ── 1. SlideLayout ─────────────────────── */

interface SlideLayoutProps {
  variant: SlideVariant;
  background?: string;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<SlideVariant, string> = {
  title: "text-center",
  content: "text-center",
  stats: "text-center",
  chart: "lg:text-left",
  cta: "text-center",
};

export function SlideLayout({ variant, background, children, className }: SlideLayoutProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = ref.current.querySelectorAll("[data-animate]");
    if (targets.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center w-full min-h-full px-8 md:px-16 py-8",
        variantStyles[variant],
        className,
      )}
      style={{
        background: background ?? "radial-gradient(ellipse at 50% 30%, rgba(249,115,22,0.06) 0%, transparent 70%)",
        backgroundColor: tokens.bg,
        color: tokens.text,
      }}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-6">
        {children}
      </div>
    </div>
  );
}

/* ── 2. SlideTitle ──────────────────────── */

interface SlideTitleProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  className?: string;
}

export function SlideTitle({ eyebrow, title, subtitle, className }: SlideTitleProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {eyebrow && (
        <span
          data-animate
          className="text-sm font-semibold font-mono uppercase tracking-[0.2em]"
          style={{ color: tokens.accent }}
        >
          {eyebrow}
        </span>
      )}
      <h2 data-animate className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p data-animate className="text-base max-w-lg leading-relaxed" style={{ color: tokens.muted }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ── 3. SlideStatGrid ───────────────────── */

interface SlideStatGridProps {
  stats: StatItem[];
  className?: string;
}

export function SlideStatGrid({ stats, className }: SlideStatGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-5 sm:gap-6 w-full max-w-2xl", className)}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          data-animate
          className="relative overflow-hidden rounded-2xl bg-zinc-50/80 border border-zinc-200/40 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${stat.gradientFrom}33 0%, transparent 60%)` }}
          />
          <div className="relative flex flex-col gap-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${stat.gradientFrom}15` }}
            >
              {stat.icon}
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-zinc-900 tracking-tight leading-none">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-xs sm:text-sm font-mono" style={{ color: tokens.muted }}>{stat.unit}</span>
                )}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: tokens.muted }}>{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── 4. SlideStepFlow ───────────────────── */

interface SlideStepFlowProps {
  steps: StepItem[];
  className?: string;
}

function StepArrowH() {
  return (
    <div className="hidden sm:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 3L9 7L5 11" stroke="rgba(251,146,60,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function StepArrowV() {
  return (
    <div className="flex sm:hidden justify-center py-1">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 5L7 9L11 5" stroke="rgba(251,146,60,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function SlideStepFlow({ steps, className }: SlideStepFlowProps) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 w-full max-w-4xl", className)}>
      {steps.map((step, i) => (
        <div key={step.num} className="relative" data-animate>
          <div
            className="text-center h-full rounded-2xl bg-zinc-50/80 border border-zinc-200/40 p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col items-center gap-5"
          >
            <div
              className={cn("inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br shadow-md", step.gradient)}
            >
              <span className="text-base font-bold text-white">{step.num}</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-zinc-900">{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: tokens.muted }}>{step.desc}</p>
            </div>
          </div>
          {i < steps.length - 1 && (
            <>
              <StepArrowH />
              <StepArrowV />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── 5. SlideMetricBar ──────────────────── */

interface SlideMetricBarProps {
  metrics: MetricItem[];
  className?: string;
}

export function SlideMetricBar({ metrics, className }: SlideMetricBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bars = containerRef.current.querySelectorAll<HTMLElement>("[data-metric-bar]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bars,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", delay: 0.3 },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={cn("w-full max-w-2xl space-y-4", className)}>
      {metrics.map((metric) => {
        const pct = Math.min((metric.value / metric.maxValue) * 100, 100);
        return (
          <div key={metric.label} data-animate className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-600">{metric.label}</span>
              <span className="font-mono font-bold" style={{ color: metric.color }}>
                {metric.value}
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#f4f4f5" }}>
              <div
                data-metric-bar
                className="h-full rounded-full origin-left"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${metric.color}, ${metric.color}99)` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── 6. SlideCTABlock ───────────────────── */

interface SlideCTABlockProps {
  headline: ReactNode;
  subtext?: string;
  primaryAction: CTAAction;
  secondaryAction?: CTAAction;
  techStack?: string[];
  className?: string;
}

export function SlideCTABlock({
  headline, subtext, primaryAction, secondaryAction, techStack, className,
}: SlideCTABlockProps) {
  return (
    <div className={cn("flex flex-col items-center gap-10 max-w-xl mx-auto", className)}>
      <h2 data-animate className="text-2xl sm:text-3xl font-bold leading-tight text-center">
        {headline}
      </h2>
      {subtext && (
        <p data-animate className="text-sm max-w-md text-center leading-relaxed" style={{ color: tokens.muted }}>
          {subtext}
        </p>
      )}
      <motion.div className="flex flex-col sm:flex-row gap-4 items-center">
        <a
          href={primaryAction.href}
          className={cn(
            "px-8 py-3.5 rounded-xl text-white font-bold text-base",
            "bg-gradient-to-r from-orange-500 to-red-500",
            "hover:from-orange-400 hover:to-red-400 transition-all",
            "shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40",
            "hover:scale-[1.03] active:scale-[0.98]",
          )}
        >
          {primaryAction.label}
        </a>
        {secondaryAction && (
          <a
            href={secondaryAction.href}
            className={cn(
              "px-8 py-3.5 rounded-xl text-base font-semibold",
              "border-2 border-zinc-300 text-zinc-700",
              "hover:border-orange-500/50 hover:text-zinc-900 transition-all",
            )}
          >
            {secondaryAction.label}
          </a>
        )}
      </motion.div>
      {techStack && techStack.length > 0 && (
        <div
          data-animate
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono uppercase tracking-[0.2em]"
          style={{ color: "#78716c" }}
        >
          {techStack.map((tech, i) => (
            <span key={tech} className="flex items-center gap-6">
              {i > 0 && (
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.12)" }} />
              )}
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 7. SlideBrandedFooter ──────────────── */

interface SlideBrandedFooterProps {
  companyLogo?: ReactNode;
  className?: string;
}

export function SlideBrandedFooter({ companyLogo, className }: SlideBrandedFooterProps) {
  return (
    <div
      data-animate
      className={cn("flex items-center justify-between w-full max-w-5xl pt-6 mt-auto border-t", className)}
      style={{ borderColor: tokens.card.border }}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: tokens.muted }}>
          Made with
        </span>
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: tokens.accent }}>
          Pitch99
        </span>
      </div>
      {companyLogo && <div className="flex items-center">{companyLogo}</div>}
    </div>
  );
}
