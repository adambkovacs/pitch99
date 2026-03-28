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
      style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
    >
      <motion.div variants={fadeUp} style={{ paddingBottom: "0.75rem" }}>
        <h1
          className="text-4xl sm:text-5xl font-bold leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          Ready to{" "}
          <span style={{ color: "var(--accent)" }}>generate</span>
        </h1>
        <p
          className="mt-2 text-lg text-zinc-500"
        >
          Review your inputs below, then let the magic happen.
        </p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)",
        }}
      >
        <div
          className="font-mono text-xs font-semibold uppercase"
          style={{
            padding: "0.75rem 1.25rem",
            background: "linear-gradient(135deg, #fff7ed, #fef2f2)",
            color: "#ea580c",
            letterSpacing: "0.1em",
            borderBottom: "1px solid #fed7aa",
          }}
        >
          Pitch Summary
        </div>
        <dl style={{ padding: "0.25rem 0" }}>
          {summaryItems.map((item, i) => (
            <div
              key={item.label}
              style={{
                display: "grid",
                gridTemplateColumns: "130px 1fr",
                gap: "0 1rem",
                alignItems: "baseline",
                padding: "0.75rem 1.25rem",
                borderBottom:
                  i < summaryItems.length - 1
                    ? "1px solid #f4f4f5"
                    : "none",
              }}
            >
              <dt
                className="text-xs font-semibold uppercase"
                style={{ color: "#78716c", letterSpacing: "0.05em" }}
              >
                {item.label}
              </dt>
              <dd
                className={cn(
                  "text-sm leading-relaxed",
                  item.accent && "font-mono text-xs break-all"
                )}
                style={{
                  color: item.accent ? "#0d9488" : "#1c1917",
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
