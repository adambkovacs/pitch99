"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Clock, XCircle, DollarSign, Brain, TrendingUp, Target, Users, Zap, Loader2 } from "lucide-react";
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

/* -- Icon map for dynamic rendering -- */
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

/* -- Types for generated data -- */
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

/* -- Build slides from generated data -- */
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
    const statBlocks = slide.content_blocks?.filter(b => b.type === "stat_grid") ?? [];
    const stepBlocks = slide.content_blocks?.filter(b => b.type === "step_flow") ?? [];
    const metricBlocks = slide.content_blocks?.filter(b => b.type === "metric_bar") ?? [];
    const paragraphs = slide.content_blocks?.filter(b => b.type === "paragraph" || b.type === "heading") ?? [];

    let variant: "title" | "stats" | "content" | "chart" | "cta" = "content";
    if (i === 0) variant = "title";
    else if (i === genSlides.length - 1) variant = "cta";
    else if (statBlocks.length > 0) variant = "stats";
    else if (metricBlocks.length > 0) variant = "chart";

    const stats: StatItem[] = statBlocks.flatMap(block =>
      (block.items ?? []).map((item, j) => ({
        icon: pickIcon(j),
        value: String(item.value ?? ""),
        unit: item.unit ? String(item.unit) : undefined,
        label: String(item.label ?? ""),
        gradientFrom: barColors[j % barColors.length],
      }))
    );

    const steps: StepItem[] = stepBlocks.flatMap(block =>
      (block.items ?? []).map((item, j) => ({
        num: String(j + 1).padStart(2, "0"),
        title: String(item.title ?? ""),
        desc: String(item.desc ?? item.description ?? ""),
        gradient: gradients[j % gradients.length],
      }))
    );

    const metrics: MetricItem[] = metricBlocks.flatMap(block =>
      (block.items ?? []).map((item, j) => ({
        label: String(item.label ?? ""),
        value: Number(item.value ?? 0),
        maxValue: Number(item.maxValue ?? 15),
        color: barColors[j % barColors.length],
      }))
    );

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

/* -- Page component -- */
export default function PitchByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pitch = useQuery(api.pitches.get, { id: id as Id<"pitches"> });

  // Convex returns undefined while loading, null if not found
  if (pitch === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-white/60 text-sm">Loading pitch...</p>
        </div>
      </div>
    );
  }

  if (pitch === null || !pitch.generatedSlides) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-6 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Pitch not found</h1>
            <p className="text-white/50 text-sm max-w-md">
              This pitch may have been deleted or the link is invalid.
            </p>
          </div>
          <a
            href="/intake"
            className="px-6 py-2.5 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
          >
            Create a new pitch
          </a>
        </div>
      </div>
    );
  }

  const generatedPitch: GeneratedPitch = {
    productName: pitch.productName,
    slides: pitch.generatedSlides as GeneratedSlide[],
    research: pitch.researchData as Record<string, unknown> | undefined,
    generatedAt: new Date(pitch.createdAt).toISOString(),
  };

  const slides: SlideData[] = buildSlidesFromGenerated(generatedPitch);

  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-teal-500 text-white text-xs font-semibold shadow-md">
        Generated pitch
      </div>
      <SlidePresentation slides={slides} />
    </div>
  );
}
