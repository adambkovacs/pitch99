"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
      className="space-y-10"
    >
      <motion.div variants={fadeUp}>
        <p
          className="text-sm font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--accent)" }}
        >
          Step 4 of 5
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          Your{" "}
          <span style={{ color: "var(--accent)" }}>audience</span>
        </h1>
        <p
          className="mt-3 text-lg"
          style={{ color: "var(--foreground)", opacity: 0.7 }}
        >
          Knowing who you&apos;re pitching to changes everything.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="space-y-1.5">
          <label
            htmlFor={selectId}
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--foreground)" }}
          >
            Who are you pitching to?
          </label>
          <select
            id={selectId}
            value={data.audience}
            onChange={(e) => update({ audience: e.target.value })}
            className={cn(
              "w-full rounded-xl border-2 px-4 py-3.5 text-base outline-none transition-all duration-200 appearance-none shadow-sm",
              "focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]",
              !data.audience && "text-[var(--muted)]"
            )}
            style={{
              background: "var(--surface)",
              borderColor: "var(--border-hover)",
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
