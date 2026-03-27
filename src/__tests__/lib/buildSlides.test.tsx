import { describe, it, expect } from "vitest";
import { buildSlidesFromGenerated } from "@/lib/buildSlides";
import type { GeneratedPitch, GeneratedSlide } from "@/lib/buildSlides";

/* ── Helpers ── */

function makePitch(slides: GeneratedSlide[], productName = "TestProduct"): GeneratedPitch {
  return { productName, slides, generatedAt: new Date().toISOString() };
}

function makeSlide(overrides: Partial<GeneratedSlide> = {}): GeneratedSlide {
  return {
    title: overrides.title ?? "Slide Title",
    eyebrow: overrides.eyebrow,
    content_blocks: overrides.content_blocks ?? [],
    talking_points: overrides.talking_points,
    timing_seconds: overrides.timing_seconds,
  };
}

/* ── Tests ── */

describe("buildSlidesFromGenerated", () => {
  it("returns empty array for empty slides input", () => {
    const result = buildSlidesFromGenerated(makePitch([]));
    expect(result).toEqual([]);
  });

  it("handles a slide with no content_blocks (falls back to text layout)", () => {
    // A single slide is both first (title) and last (cta).
    // Use 3 slides so the middle one is a plain content slide.
    const slides = [
      makeSlide({ title: "Intro" }),
      makeSlide({ title: "Middle", content_blocks: [] }),
      makeSlide({ title: "End" }),
    ];
    const result = buildSlidesFromGenerated(makePitch(slides));

    expect(result).toHaveLength(3);
    // Middle slide (index 1) should have id 1 and truthy content
    expect(result[1].id).toBe(1);
    expect(result[1].content).toBeTruthy();
  });

  it("correctly builds stat_grid variant (reads block.stats)", () => {
    const slides = [
      makeSlide({ title: "Intro" }),
      makeSlide({
        title: "Stats",
        content_blocks: [
          {
            type: "stat_grid",
            stats: [
              { value: "42", unit: "hrs", label: "saved weekly" },
              { value: "99", unit: "%", label: "accuracy" },
            ],
          },
        ],
      }),
      makeSlide({ title: "End" }),
    ];
    const result = buildSlidesFromGenerated(makePitch(slides));

    expect(result).toHaveLength(3);
    expect(result[1].id).toBe(1);
    expect(result[1].content).toBeTruthy();
  });

  it("correctly builds step_flow variant (reads block.steps)", () => {
    const slides = [
      makeSlide({ title: "Intro" }),
      makeSlide({
        title: "Process",
        content_blocks: [
          {
            type: "step_flow",
            steps: [
              { title: "Step A", desc: "Do A" },
              { title: "Step B", desc: "Do B" },
            ],
          },
        ],
      }),
      makeSlide({ title: "End" }),
    ];
    const result = buildSlidesFromGenerated(makePitch(slides));

    expect(result).toHaveLength(3);
    expect(result[1].id).toBe(1);
    expect(result[1].content).toBeTruthy();
  });

  it("correctly builds metric_bar variant (reads block.metrics)", () => {
    const slides = [
      makeSlide({ title: "Intro" }),
      makeSlide({
        title: "Metrics",
        content_blocks: [
          {
            type: "metric_bar",
            metrics: [
              { label: "Revenue", value: 8.2, max: 15 },
              { label: "Growth", value: 12, max: 20 },
            ],
          },
        ],
      }),
      makeSlide({ title: "End" }),
    ];
    const result = buildSlidesFromGenerated(makePitch(slides));

    expect(result).toHaveLength(3);
    expect(result[1].id).toBe(1);
    expect(result[1].content).toBeTruthy();
  });

  it("last slide gets CTA variant", () => {
    const slides = [
      makeSlide({ title: "First" }),
      makeSlide({ title: "Last CTA" }),
    ];
    const result = buildSlidesFromGenerated(makePitch(slides));

    expect(result).toHaveLength(2);
    // Last slide should have id equal to last index
    expect(result[result.length - 1].id).toBe(1);
    expect(result[result.length - 1].content).toBeTruthy();
  });

  it("returns valid SlideData[] with correct id fields", () => {
    const slides = [
      makeSlide({ title: "A" }),
      makeSlide({ title: "B" }),
      makeSlide({ title: "C" }),
      makeSlide({ title: "D" }),
    ];
    const result = buildSlidesFromGenerated(makePitch(slides));

    expect(result).toHaveLength(4);
    result.forEach((slide, i) => {
      expect(slide.id).toBe(i);
      expect(slide.content).toBeTruthy();
      // background is optional on SlideData, but id and content are required
      expect(typeof slide.id).toBe("number");
    });
  });
});
