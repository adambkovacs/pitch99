"use client";

import { motion } from "framer-motion";
import {
  Check,
  Rocket,
  Users,
  Target,
  Lightbulb,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const STEPS = [
  { label: "Product", icon: Lightbulb },
  { label: "Sources", icon: FileText },
  { label: "Pitcher", icon: Users },
  { label: "Audience", icon: Target },
  { label: "Generate", icon: Rocket },
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
        className="h-1 w-full"
        style={{ background: "var(--border)" }}
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${current + 1} of ${total}`}
      >
        <motion.div
          className="h-full"
          style={{
            background: "linear-gradient(90deg, var(--accent), var(--coral))",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Step pills */}
      <nav
        className="flex items-center justify-center gap-2 py-4 px-6"
        style={{
          background: "rgba(250, 250, 249, 0.85)",
          backdropFilter: "blur(12px)",
        }}
        aria-label="Form progress"
      >
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === current;
          const isComplete = i < current;

          return (
            <div key={step.label} className="flex items-center gap-2">
              <motion.div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 min-h-[44px] min-w-[44px] justify-center",
                  isActive && "text-white",
                  isComplete && "text-white",
                  !isActive && !isComplete && "text-[var(--muted)]"
                )}
                style={{
                  background: isActive
                    ? "var(--accent)"
                    : isComplete
                      ? "var(--teal)"
                      : "var(--border)",
                }}
                animate={{
                  scale: isActive ? 1 : 0.95,
                }}
                transition={{ duration: 0.2 }}
                role="listitem"
                aria-label={`Step ${i + 1}: ${step.label}${isComplete ? " (completed)" : isActive ? " (current)" : " (upcoming)"}`}
                aria-current={isActive ? "step" : undefined}
              >
                {isComplete ? (
                  <Check
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  />
                ) : (
                  <Icon
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  />
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </motion.div>

              {i < STEPS.length - 1 && (
                <div
                  className="w-6 h-px"
                  style={{
                    background:
                      i < current ? "var(--teal)" : "var(--border)",
                  }}
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
