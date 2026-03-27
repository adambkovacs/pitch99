"use client";

import { useEffect, useState } from "react";
import { Clock, XCircle, DollarSign, Brain, TrendingUp, Target, Users, Zap } from "lucide-react";
import SlidePresentation from "@/components/slides/SlidePresentation";
import type { SlideData } from "@/components/slides/SlidePresentation";
import {
  SlideLayout,
  SlideTitle,
  SlideStatGrid,
  SlideStepFlow,
  SlideMetricBar,
  SlideCTABlock,
} from "@/components/slides/SlideTemplate";
import type {
  StatItem,
  StepItem,
  MetricItem,
} from "@/components/slides/SlideTemplate";

/* ── Icon map for dynamic rendering ── */
const ICONS: Record<string, React.ReactNode> = {
  clock: <Clock className="w-6 h-6 text-red-500" />,
  x: <XCircle className="w-6 h-6 text-orange-600" />,
  dollar: <DollarSign className="w-6 h-6 text-amber-600" />,
  brain: <Brain className="w-6 h-6 text-rose-500" />,
  trending: <TrendingUp className="w-6 h-6 text-teal-500" />,
  target: <Target className="w-6 h-6 text-orange-500" />,
  users: <Users className="w-6 h-6 text-blue-500" />,
  zap: <Zap className="w-6 h-6 text-amber-500" />,
};

function pickIcon(index: number): React.ReactNode {
  const keys = Object.keys(ICONS);
  return ICONS[keys[index % keys.length]];
}

/* ── Types for generated data ── */
interface GeneratedSlide {
  title: string;
  eyebrow?: string;
  content_blocks: Array<{
    type: string;
    text?: string;
    items?: Array<Record<string, string | number>>;
  }>;
  talking_points?: string;
  timing_seconds?: number;
}

interface GeneratedPitch {
  productName: string;
  slides: GeneratedSlide[];
  research?: Record<string, unknown>;
  generatedAt: string;
}

/* ── Fallback demo data ── */
const fallbackStats: StatItem[] = [
  { icon: <Clock className="w-6 h-6 text-red-500" />, value: "38", unit: "hrs", label: "Average time founders spend building a pitch deck", gradientFrom: "#ef4444" },
  { icon: <XCircle className="w-6 h-6 text-orange-600" />, value: "72%", label: "Of pitch decks fail to secure a second meeting", gradientFrom: "#f97316" },
  { icon: <DollarSign className="w-6 h-6 text-amber-600" />, value: "$5K", label: "Typical cost of a professional deck designer", gradientFrom: "#eab308" },
  { icon: <Brain className="w-6 h-6 text-rose-500" />, value: "1 in 10", label: "Startups feel confident in their pitch narrative", gradientFrom: "#f97316" },
];

const fallbackSteps: StepItem[] = [
  { num: "01", title: "Describe", desc: "Answer a few questions about your company, market, and goals.", gradient: "from-orange-500 to-orange-600" },
  { num: "02", title: "Generate", desc: "AI crafts a narrative arc with data-backed slides in seconds.", gradient: "from-red-500 to-red-600" },
  { num: "03", title: "Refine", desc: "Tweak copy, swap layouts, and adjust the tone to match your brand.", gradient: "from-rose-500 to-rose-600" },
  { num: "04", title: "Present", desc: "Launch a cinematic full-screen deck or export to PDF.", gradient: "from-teal-500 to-teal-600" },
];

const fallbackMetrics: MetricItem[] = [
  { label: "Global Presentation Software Market", value: 12.4, maxValue: 15, color: "#f97316" },
  { label: "AI Content Generation TAM", value: 8.7, maxValue: 15, color: "#fb923c" },
  { label: "Startup Pitch Services Spend", value: 4.2, maxValue: 15, color: "#ef4444" },
  { label: "Pitch99 Addressable Segment", value: 2.8, maxValue: 15, color: "#dc2626" },
];

/* ── Build slides from generated data ── */
function buildSlidesFromGenerated(pitch: GeneratedPitch): SlideData[] {
  const { productName, slides: genSlides } = pitch;
  const gradients = [
    "from-orange-500 to-orange-600",
    "from-red-500 to-red-600",
    "from-rose-500 to-rose-600",
    "from-teal-500 to-teal-600",
  ];
  const barColors = ["#f97316", "#fb923c", "#ef4444", "#dc2626", "#0d9488"];

  return genSlides.map((slide, i) => {
    // Try to extract content from the slide's content_blocks
    const statBlocks = slide.content_blocks?.filter(b => b.type === "stat_grid") ?? [];
    const stepBlocks = slide.content_blocks?.filter(b => b.type === "step_flow") ?? [];
    const metricBlocks = slide.content_blocks?.filter(b => b.type === "metric_bar") ?? [];
    const paragraphs = slide.content_blocks?.filter(b => b.type === "paragraph" || b.type === "heading") ?? [];

    // Determine slide type based on content
    let variant: "title" | "stats" | "content" | "chart" | "cta" = "content";
    if (i === 0) variant = "title";
    else if (i === genSlides.length - 1) variant = "cta";
    else if (statBlocks.length > 0) variant = "stats";
    else if (metricBlocks.length > 0) variant = "chart";

    // Build stats from content blocks
    const stats: StatItem[] = statBlocks.flatMap(block =>
      (block.items ?? []).map((item, j) => ({
        icon: pickIcon(j),
        value: String(item.value ?? ""),
        unit: item.unit ? String(item.unit) : undefined,
        label: String(item.label ?? ""),
        gradientFrom: barColors[j % barColors.length],
      }))
    );

    // Build steps from content blocks
    const steps: StepItem[] = stepBlocks.flatMap(block =>
      (block.items ?? []).map((item, j) => ({
        num: String(j + 1).padStart(2, "0"),
        title: String(item.title ?? ""),
        desc: String(item.desc ?? item.description ?? ""),
        gradient: gradients[j % gradients.length],
      }))
    );

    // Build metrics from content blocks
    const metrics: MetricItem[] = metricBlocks.flatMap(block =>
      (block.items ?? []).map((item, j) => ({
        label: String(item.label ?? ""),
        value: Number(item.value ?? 0),
        maxValue: Number(item.maxValue ?? 15),
        color: barColors[j % barColors.length],
      }))
    );

    // Build subtitle from paragraphs
    const subtitle = paragraphs.map(p => p.text).filter(Boolean).join(" ") || undefined;

    if (variant === "title") {
      return {
        id: i,
        content: (
          <SlideLayout variant="title">
            <SlideTitle
              eyebrow={slide.eyebrow ?? "Presenting"}
              title={
                <span className="text-5xl sm:text-7xl font-black">
                  {productName}
                </span>
              }
              subtitle={subtitle ?? slide.title}
            />
          </SlideLayout>
        ),
      };
    }

    if (variant === "cta") {
      return {
        id: i,
        content: (
          <SlideLayout variant="cta">
            <SlideCTABlock
              headline={<span>{slide.title}</span>}
              subtext={subtitle}
              primaryAction={{ label: "Create Your Pitch", href: "/intake" }}
              secondaryAction={{ label: "View on GitHub", href: "https://github.com/adambkovacs/pitch99" }}
              techStack={["Next.js", "OpenRouter", "GSAP", "Framer Motion"]}
            />
          </SlideLayout>
        ),
      };
    }

    if (stats.length > 0) {
      return {
        id: i,
        content: (
          <SlideLayout variant="stats">
            <SlideTitle eyebrow={slide.eyebrow} title={slide.title} subtitle={subtitle} />
            <SlideStatGrid stats={stats} />
          </SlideLayout>
        ),
      };
    }

    if (steps.length > 0) {
      return {
        id: i,
        content: (
          <SlideLayout variant="content">
            <SlideTitle eyebrow={slide.eyebrow} title={slide.title} subtitle={subtitle} />
            <SlideStepFlow steps={steps} />
          </SlideLayout>
        ),
      };
    }

    if (metrics.length > 0) {
      return {
        id: i,
        content: (
          <SlideLayout variant="chart">
            <SlideTitle eyebrow={slide.eyebrow} title={slide.title} subtitle={subtitle} />
            <SlideMetricBar metrics={metrics} />
          </SlideLayout>
        ),
      };
    }

    // Default: text slide
    return {
      id: i,
      content: (
        <SlideLayout variant="content">
          <SlideTitle eyebrow={slide.eyebrow} title={slide.title} subtitle={subtitle} />
        </SlideLayout>
      ),
    };
  });
}

/* ── Fallback slides (shown when no generated data) ── */
function buildFallbackSlides(): SlideData[] {
  return [
    {
      id: 0,
      content: (
        <SlideLayout variant="title">
          <SlideTitle
            eyebrow="Introducing"
            title={
              <span>
                <span className="text-5xl sm:text-7xl font-black">Pitch</span>
                <span className="text-5xl sm:text-7xl font-black gradient-text">99</span>
              </span>
            }
            subtitle="From repo to investor deck in 99 seconds. AI-generated narrative. Cinematic slides. Zero design skills required."
          />
        </SlideLayout>
      ),
    },
    {
      id: 1,
      content: (
        <SlideLayout variant="stats">
          <SlideTitle eyebrow="The Problem" title="Pitching is broken" subtitle="Founders waste weeks on decks that don't convert. The tools are generic, the process is slow, and the stakes are high." />
          <SlideStatGrid stats={fallbackStats} />
        </SlideLayout>
      ),
    },
    {
      id: 2,
      content: (
        <SlideLayout variant="content">
          <SlideTitle eyebrow="The Solution" title="From idea to investor deck in 4 steps" subtitle="Pitch99 combines narrative AI with cinematic slide design so you focus on your story, not your slides." />
          <SlideStepFlow steps={fallbackSteps} />
        </SlideLayout>
      ),
    },
    {
      id: 3,
      content: (
        <SlideLayout variant="chart">
          <SlideTitle eyebrow="Market Opportunity" title="A $12B+ market ripe for disruption" subtitle="Presentation software is massive, but none of it is built for the founder fundraising workflow. Values in $B." />
          <SlideMetricBar metrics={fallbackMetrics} />
        </SlideLayout>
      ),
    },
    {
      id: 4,
      content: (
        <SlideLayout variant="cta">
          <SlideCTABlock
            headline={<span>Ready to pitch like a <span style={{ color: "#f97316" }}>pro</span>?</span>}
            subtext="Join the waitlist and be among the first founders to generate investor-ready decks with AI."
            primaryAction={{ label: "Get Early Access", href: "/intake" }}
            secondaryAction={{ label: "View Source", href: "https://github.com/adambkovacs/pitch99" }}
            techStack={["Next.js 16", "OpenRouter", "GSAP", "Framer Motion"]}
          />
        </SlideLayout>
      ),
    },
  ];
}

/* ── Page component ── */
export default function PitchDemoPage() {
  const [slides, setSlides] = useState<SlideData[]>(buildFallbackSlides());
  const [source, setSource] = useState<"fallback" | "generated">("fallback");

  useEffect(() => {
    const stored = localStorage.getItem("pitch99_generated");
    if (stored) {
      try {
        const pitch = JSON.parse(stored) as GeneratedPitch;
        if (pitch.slides && pitch.slides.length > 0) {
          setSlides(buildSlidesFromGenerated(pitch));
          setSource("generated");
        }
      } catch {
        // Invalid data, use fallback
      }
    }
  }, []);

  return (
    <div className="relative">
      {source === "generated" && (
        <div className="fixed top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-teal-500 text-white text-xs font-semibold shadow-md">
          Generated pitch
        </div>
      )}
      <SlidePresentation slides={slides} />
    </div>
  );
}
