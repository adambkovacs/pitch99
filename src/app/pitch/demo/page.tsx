"use client";

import { Clock, XCircle, DollarSign, Brain } from "lucide-react";
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
    icon: <Clock className="w-6 h-6 text-red-500" />,
    value: "38",
    unit: "hrs",
    label: "Average time founders spend building a pitch deck",
    gradientFrom: "#ef4444",
  },
  {
    icon: <XCircle className="w-6 h-6 text-orange-600" />,
    value: "72%",
    label: "Of pitch decks fail to secure a second meeting",
    gradientFrom: "#f97316",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-amber-600" />,
    value: "$5K",
    label: "Typical cost of a professional deck designer",
    gradientFrom: "#eab308",
  },
  {
    icon: <Brain className="w-6 h-6 text-rose-500" />,
    value: "1 in 10",
    label: "Startups feel confident in their pitch narrative",
    gradientFrom: "#f97316",
  },
];

const solutionSteps: StepItem[] = [
  {
    num: "01",
    title: "Describe",
    desc: "Answer a few questions about your company, market, and goals.",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    num: "02",
    title: "Generate",
    desc: "AI crafts a narrative arc with data-backed slides in seconds.",
    gradient: "from-red-500 to-red-600",
  },
  {
    num: "03",
    title: "Refine",
    desc: "Tweak copy, swap layouts, and adjust the tone to match your brand.",
    gradient: "from-rose-500 to-rose-600",
  },
  {
    num: "04",
    title: "Present",
    desc: "Launch a cinematic full-screen deck or export to PDF.",
    gradient: "from-teal-500 to-teal-600",
  },
];

const marketMetrics: MetricItem[] = [
  { label: "Global Presentation Software Market", value: 12.4, maxValue: 15, color: "#f97316" },
  { label: "AI Content Generation TAM", value: 8.7, maxValue: 15, color: "#fb923c" },
  { label: "Startup Pitch Services Spend", value: 4.2, maxValue: 15, color: "#ef4444" },
  { label: "Pitch99 Addressable Segment", value: 2.8, maxValue: 15, color: "#dc2626" },
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
              Ready to pitch like a <span style={{ color: "#f97316" }}>pro</span>?
            </span>
          }
          subtext="Join the waitlist and be among the first founders to generate investor-ready decks with AI."
          primaryAction={{ label: "Get Early Access", href: "/intake" }}
          secondaryAction={{ label: "View Source", href: "https://github.com/adambkovacs/pitch99" }}
          techStack={["Next.js 16", "OpenRouter", "GSAP", "Framer Motion"]}
        />
      </SlideLayout>
    ),
  },
];

/* ── Page component ── */

export default function PitchDemoPage() {
  return <SlidePresentation slides={slides} />;
}
