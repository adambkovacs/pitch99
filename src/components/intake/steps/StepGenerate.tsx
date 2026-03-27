"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerChildren, fadeUp } from "../animations";
import { AUDIENCES } from "../types";
import type { PitchFormData } from "../types";

export function StepGenerate({
  data,
  onGenerate,
  isGenerating,
}: {
  data: PitchFormData;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  const summaryItems = [
    { label: "Product", value: data.productName, accent: false },
    { label: "Description", value: data.description, accent: false },
    { label: "GitHub", value: data.githubUrl, accent: true },
    { label: "Website", value: data.websiteUrl, accent: true },
    {
      label: "Files",
      value:
        data.files.length > 0
          ? data.files.map((f) => f.name).join(", ")
          : "",
      accent: false,
    },
    { label: "LinkedIn", value: data.linkedinUrl, accent: true },
    { label: "Bio", value: data.bio, accent: false },
    {
      label: "Audience",
      value:
        AUDIENCES.find((a) => a.value === data.audience)?.label ??
        "",
      accent: false,
    },
    {
      label: "Desired outcome",
      value: data.desiredOutcome,
      accent: false,
    },
  ].filter((item) => item.value);

  return (
    <motion.div
      variants={staggerChildren}
      initial="enter"
      animate="center"
      className="space-y-10"
    >
      <motion.div variants={fadeUp}>
        <p
          className="text-sm font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--coral)" }}
        >
          Step 5 of 5
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          Ready to{" "}
          <span style={{ color: "var(--accent)" }}>generate</span>
        </h1>
        <p
          className="mt-3 text-lg"
          style={{ color: "var(--foreground)", opacity: 0.7 }}
        >
          Review your inputs below, then let the magic happen.
        </p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{
          background: "var(--surface)",
          border: "2px solid var(--border)",
        }}
      >
        <div
          className="px-6 py-3 border-b font-semibold text-sm tracking-wide uppercase"
          style={{
            borderColor: "var(--border)",
            background: "var(--accent-soft)",
            color: "var(--foreground)",
          }}
        >
          Pitch Summary
        </div>
        <dl>
          {summaryItems.map((item, i) => (
            <div
              key={item.label}
              className="px-6 py-4 grid grid-cols-[120px_1fr] gap-x-6 items-baseline"
              style={{
                borderBottom:
                  i < summaryItems.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              <dt
                className="text-sm font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                {item.label}
              </dt>
              <dd
                className={cn(
                  "text-sm leading-relaxed",
                  item.accent && "font-mono text-xs break-all"
                )}
                style={{
                  color: item.accent
                    ? "var(--teal)"
                    : "var(--foreground)",
                  opacity: item.accent ? 1 : 0.8,
                }}
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>

      {/* Generate button */}
      <motion.div variants={fadeUp}>
        <motion.button
          onClick={onGenerate}
          disabled={isGenerating}
          className={cn(
            "w-full py-4 rounded-xl text-white text-lg font-semibold relative overflow-hidden",
            "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2",
            isGenerating
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer"
          )}
          style={{
            background:
              "linear-gradient(135deg, var(--accent), var(--coral))",
          }}
          whileHover={
            isGenerating
              ? {}
              : {
                  scale: 1.01,
                  boxShadow:
                    "0 8px 30px rgba(249, 115, 22, 0.25)",
                }
          }
          whileTap={isGenerating ? {} : { scale: 0.98 }}
          aria-label="Generate my pitch deck"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" aria-hidden="true" />
            Generate My Pitch
          </span>
        </motion.button>
        <p
          className="text-center text-xs mt-3"
          style={{ color: "var(--muted)" }}
        >
          Your 99-second pitch deck will be ready in about 30
          seconds.
        </p>
      </motion.div>
    </motion.div>
  );
}
