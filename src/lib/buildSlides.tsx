import { Clock, XCircle, DollarSign, Brain, TrendingUp, Target, Users, Zap } from "lucide-react";
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
export const ICONS: Record<string, React.ReactNode> = {
  clock: <Clock className="w-6 h-6 text-red-500" />,
  x: <XCircle className="w-6 h-6 text-orange-600" />,
  dollar: <DollarSign className="w-6 h-6 text-amber-600" />,
  brain: <Brain className="w-6 h-6 text-rose-500" />,
  trending: <TrendingUp className="w-6 h-6 text-teal-500" />,
  target: <Target className="w-6 h-6 text-orange-500" />,
  users: <Users className="w-6 h-6 text-blue-500" />,
  zap: <Zap className="w-6 h-6 text-amber-500" />,
};

export function pickIcon(index: number): React.ReactNode {
  const keys = Object.keys(ICONS);
  return ICONS[keys[index % keys.length]];
}

/* ── Types for generated data ── */
export interface GeneratedSlide {
  title: string;
  eyebrow?: string;
  content_blocks: Array<{
    type: string;
    text?: string;
    items?: Array<Record<string, string | number>>;
    stats?: Array<Record<string, string | number>>;
    steps?: Array<Record<string, string | number>>;
    metrics?: Array<Record<string, string | number>>;
  }>;
  talking_points?: string;
  timing_seconds?: number;
}

export interface GeneratedPitch {
  productName: string;
  slides: GeneratedSlide[];
  research?: Record<string, unknown>;
  generatedAt: string;
}

/* ── Build slides from generated data ── */
export function buildSlidesFromGenerated(pitch: GeneratedPitch): SlideData[] {
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
      (block.stats ?? block.items ?? []).map((item, j) => ({
        icon: pickIcon(j),
        value: String(item.value ?? ""),
        unit: item.unit ? String(item.unit) : undefined,
        label: String(item.label ?? ""),
        gradientFrom: barColors[j % barColors.length],
      }))
    );

    // Build steps from content blocks
    const steps: StepItem[] = stepBlocks.flatMap(block =>
      (block.steps ?? block.items ?? []).map((item, j) => ({
        num: String(j + 1).padStart(2, "0"),
        title: String(item.title ?? ""),
        desc: String(item.desc ?? item.description ?? ""),
        gradient: gradients[j % gradients.length],
      }))
    );

    // Build metrics from content blocks
    const metrics: MetricItem[] = metricBlocks.flatMap(block =>
      (block.metrics ?? block.items ?? []).map((item, j) => ({
        label: String(item.label ?? ""),
        value: Number(item.value ?? 0),
        maxValue: Number(item.max ?? item.maxValue ?? 15),
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
