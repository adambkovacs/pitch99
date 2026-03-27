"use client";

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

/* ── Demo data (structured as the generate API would return) ── */

const problemStats: StatItem[] = [
  {
    icon: "\u23F3",
    value: "38",
    unit: "hrs",
    label: "Average time founders spend building a pitch deck",
    gradientFrom: "#ef4444",
  },
  {
    icon: "\u274C",
    value: "72%",
    label: "Of pitch decks fail to secure a second meeting",
    gradientFrom: "#f97316",
  },
  {
    icon: "\uD83D\uDCB8",
    value: "$5K",
    label: "Typical cost of a professional deck designer",
    gradientFrom: "#eab308",
  },
  {
    icon: "\uD83E\uDDE0",
    value: "1 in 10",
    label: "Startups feel confident in their pitch narrative",
    gradientFrom: "#8b5cf6",
  },
];

const solutionSteps: StepItem[] = [
  {
    num: "01",
    title: "Describe",
    desc: "Answer a few questions about your company, market, and goals.",
    gradient: "from-violet-600 to-purple-600",
  },
  {
    num: "02",
    title: "Generate",
    desc: "AI crafts a narrative arc with data-backed slides in seconds.",
    gradient: "from-purple-600 to-fuchsia-600",
  },
  {
    num: "03",
    title: "Refine",
    desc: "Tweak copy, swap layouts, and adjust the tone to match your brand.",
    gradient: "from-fuchsia-600 to-pink-600",
  },
  {
    num: "04",
    title: "Present",
    desc: "Launch a cinematic full-screen deck or export to PDF.",
    gradient: "from-pink-600 to-rose-600",
  },
];

const marketMetrics: MetricItem[] = [
  { label: "Global Presentation Software Market", value: 12.4, maxValue: 15, color: "#a78bfa" },
  { label: "AI Content Generation TAM", value: 8.7, maxValue: 15, color: "#c084fc" },
  { label: "Startup Pitch Services Spend", value: 4.2, maxValue: 15, color: "#e879f9" },
  { label: "Pitch99 Addressable Segment", value: 2.8, maxValue: 15, color: "#f472b6" },
];

/* ── Compose slides from template building blocks ── */

const slides: SlideData[] = [
  {
    id: 1,
    content: (
      <SlideLayout variant="title">
        <SlideTitle
          eyebrow="Introducing"
          title={
            <span>
              Pitch<span style={{ color: "#a78bfa" }}>99</span>
            </span>
          }
          subtitle="Your AI pitch co-pilot. Describe your startup, get a cinematic investor deck in 99 seconds."
        />
      </SlideLayout>
    ),
  },
  {
    id: 2,
    content: (
      <SlideLayout variant="stats">
        <SlideTitle
          eyebrow="The Problem"
          title="Pitching is broken"
          subtitle="Founders waste weeks on decks that don't convert. The tools are generic, the process is slow, and the stakes are high."
        />
        <SlideStatGrid stats={problemStats} />
      </SlideLayout>
    ),
  },
  {
    id: 3,
    content: (
      <SlideLayout variant="content">
        <SlideTitle
          eyebrow="The Solution"
          title="From idea to investor deck in 4 steps"
          subtitle="Pitch99 combines narrative AI with cinematic slide design so you focus on your story, not your slides."
        />
        <SlideStepFlow steps={solutionSteps} />
      </SlideLayout>
    ),
  },
  {
    id: 4,
    content: (
      <SlideLayout variant="chart">
        <SlideTitle
          eyebrow="Market Opportunity"
          title="A $12B+ market ripe for disruption"
          subtitle="Presentation software is massive, but none of it is built for the founder fundraising workflow. Values in $B."
        />
        <SlideMetricBar metrics={marketMetrics} />
      </SlideLayout>
    ),
  },
  {
    id: 5,
    content: (
      <SlideLayout variant="cta">
        <SlideCTABlock
          headline={
            <span>
              Ready to pitch like a <span style={{ color: "#a78bfa" }}>pro</span>?
            </span>
          }
          subtext="Join the waitlist and be among the first founders to generate investor-ready decks with AI."
          primaryAction={{ label: "Get Early Access", href: "/intake" }}
          secondaryAction={{ label: "View Source", href: "https://github.com/pitch99" }}
          techStack={["Next.js 16", "GPT-4o", "GSAP", "Framer Motion"]}
        />
      </SlideLayout>
    ),
  },
];

/* ── Page component ── */

export default function PitchDemoPage() {
  return <SlidePresentation slides={slides} />;
}
