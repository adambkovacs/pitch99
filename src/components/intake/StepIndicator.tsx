"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STEPS = [
  { label: "Product" },
  { label: "Sources" },
  { label: "Pitcher" },
  { label: "Audience" },
  { label: "Generate" },
];

export function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <div
        className="h-0.5 w-full bg-zinc-200"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${current + 1} of ${total}`}
      >
        <motion.div
          className="h-full bg-orange-500"
          initial={{ width: "0%" }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Step nav — clean text-based stepper */}
      <nav
        className="flex items-center justify-center gap-1 py-3 px-6"
        style={{
          background: "rgba(250, 250, 249, 0.9)",
          backdropFilter: "blur(12px)",
        }}
        aria-label="Form progress"
        role="list"
      >
        {STEPS.map((step, i) => {
          const isActive = i === current;
          const isComplete = i < current;

          return (
            <div key={step.label} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 text-sm transition-all duration-300",
                  isActive && "font-semibold text-zinc-900",
                  isComplete && "font-medium text-teal-600",
                  !isActive && !isComplete && "font-medium text-zinc-400"
                )}
                role="listitem"
                aria-label={`Step ${i + 1}: ${step.label}${isComplete ? " (completed)" : isActive ? " (current)" : " (upcoming)"}`}
                aria-current={isActive ? "step" : undefined}
              >
                {isComplete && (
                  <Check
                    className="w-3.5 h-3.5 text-teal-500"
                    aria-hidden="true"
                  />
                )}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" aria-hidden="true" />
                )}
                <span className={cn("hidden sm:inline", isActive && "inline")}>{step.label}</span>
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-4 sm:w-8 h-px mx-0.5 sm:mx-1 transition-colors duration-300",
                    i < current ? "bg-teal-400" : "bg-zinc-200"
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
