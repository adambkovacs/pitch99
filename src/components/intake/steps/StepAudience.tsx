"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { TextareaField } from "../TextareaField";
import { staggerChildren, fadeUp } from "../animations";
import { AUDIENCES } from "../types";
import type { PitchFormData } from "../types";

export function StepAudience({
  data,
  update,
}: {
  data: PitchFormData;
  update: (patch: Partial<PitchFormData>) => void;
}) {
  const selectId = useId();

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
          Your{" "}
          <span style={{ color: "var(--accent)" }}>audience</span>
        </h1>
        <p
          className="mt-2 text-lg text-zinc-500"
        >
          Knowing who you&apos;re pitching to changes everything.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div>
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold"
            style={{ color: "var(--foreground)", marginBottom: "0.5rem" }}
          >
            Who are you pitching to?
          </label>
          <div className="relative">
            <select
              id={selectId}
              value={data.audience}
              onChange={(e) => update({ audience: e.target.value })}
              className={cn(
                "w-full rounded-xl border px-4 py-3.5 pr-10 text-base outline-none transition-all duration-200 appearance-none",
                "bg-white shadow-sm",
                "hover:border-zinc-400",
                "focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)]",
                !data.audience && "text-[var(--muted)]"
              )}
              style={{
                borderColor: "#d4d4d8",
                color: data.audience
                  ? "var(--foreground)"
                  : "var(--muted)",
              }}
            >
              {AUDIENCES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <TextareaField
          label="What outcome do you want?"
          placeholder="e.g. Secure a $500K seed round, land 10 enterprise pilots, win the Demo Day prize..."
          value={data.desiredOutcome}
          onChange={(v) => update({ desiredOutcome: v })}
          rows={3}
        />
      </motion.div>
    </motion.div>
  );
}
