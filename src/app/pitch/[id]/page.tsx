"use client";

import { use, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { XCircle, Loader2 } from "lucide-react";
import SlidePresentation from "@/components/slides/SlidePresentation";
import type { SlideData } from "@/components/slides/SlidePresentation";
import { buildSlidesFromGenerated } from "@/lib/buildSlides";
import type { GeneratedPitch, GeneratedSlide } from "@/lib/buildSlides";

/* ── Page component ── */
export default function PitchByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pitch = useQuery(api.pitches.get, { id: id as Id<"pitches"> });

  // Convex returns undefined while loading, null if not found
  if (pitch === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading pitch...</p>
        </div>
      </div>
    );
  }

  if (pitch === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-6 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Pitch not found</h1>
            <p className="text-sm max-w-md" style={{ color: "var(--muted)" }}>
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

  if (pitch.status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-6 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Something went wrong</h1>
            <p className="text-sm max-w-md" style={{ color: "var(--muted)" }}>
              Something went wrong generating your pitch. Please try again.
            </p>
          </div>
          <a
            href="/intake"
            className="px-6 py-2.5 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  if (!pitch.generatedSlides) {
    const isGenerating = ["intake", "enriching", "researching", "generating"].includes(pitch.status);
    if (isGenerating) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-sm" style={{ color: "var(--muted)" }}>Your pitch is being generated...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-6 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Pitch not found</h1>
            <p className="text-sm max-w-md" style={{ color: "var(--muted)" }}>
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

  // Schema now types generatedSlides as an array of slide objects.
  // Map to GeneratedSlide[], defaulting content_blocks to [] since the
  // schema marks it optional while GeneratedSlide requires it.
  const slides_raw = pitch.generatedSlides ?? [];
  const typedSlides: GeneratedSlide[] = slides_raw.map((s) => ({
    title: s.title,
    eyebrow: s.eyebrow,
    content_blocks: (s.content_blocks ?? []) as GeneratedSlide["content_blocks"],
    talking_points: s.talking_points,
    timing_seconds: s.timing_seconds,
  }));

  const generatedPitch: GeneratedPitch = {
    productName: pitch.productName,
    slides: typedSlides,
    // researchData is still v.any() in the schema — cast for downstream use
    research: pitch.researchData as Record<string, unknown> | undefined,
    generatedAt: new Date(pitch.createdAt).toISOString(),
  };

  const slides: SlideData[] = useMemo(
    () => buildSlidesFromGenerated(generatedPitch),
    [pitch._id],
  );

  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-teal-500 text-white text-xs font-semibold shadow-md">
        Generated pitch
      </div>
      <SlidePresentation slides={slides} />
    </div>
  );
}
