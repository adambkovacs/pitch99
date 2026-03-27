"use client";

import { motion } from "framer-motion";
import { Zap, Check, Loader2 } from "lucide-react";

import type { GeneratingState, GeneratingStage } from "./types";

export const GENERATION_STAGES: {
  key: GeneratingStage;
  label: string;
  description: string;
}[] = [
  {
    key: "enrich",
    label: "Analyzing your sources",
    description:
      "Scraping GitHub, website, and LinkedIn for context...",
  },
  {
    key: "research",
    label: "Researching your market",
    description:
      "Analyzing TAM, competitors, and ideal customer profiles...",
  },
  {
    key: "generate",
    label: "Generating your pitch",
    description:
      "Crafting 5 compelling slides tailored to your audience...",
  },
];

function PulsingOrb({
  active,
  complete,
}: {
  active: boolean;
  complete: boolean;
}) {
  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      {active && !complete && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--accent)" }}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        />
      )}
      <motion.div
        className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: complete
            ? "var(--teal)"
            : active
              ? "var(--accent)"
              : "var(--border)",
        }}
        animate={
          active && !complete ? { scale: [1, 1.05, 1] } : {}
        }
        transition={
          active && !complete
            ? {
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {}
        }
      >
        {complete ? (
          <Check
            className="w-5 h-5 text-white"
            aria-hidden="true"
          />
        ) : active ? (
          <Loader2
            className="w-5 h-5 text-white animate-spin"
            aria-hidden="true"
          />
        ) : (
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "var(--muted)" }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </div>
  );
}

export function GeneratingScreen({
  state,
}: {
  state: GeneratingState;
}) {
  const stageIndex = GENERATION_STAGES.findIndex(
    (s) => s.key === state.stage
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-10"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Zap
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "var(--accent)" }}
            aria-hidden="true"
          />
          <h1
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Crafting your{" "}
            <span style={{ color: "var(--accent)" }}>pitch</span>
          </h1>
          <p
            className="mt-3 text-lg"
            style={{
              color: "var(--foreground)",
              opacity: 0.7,
            }}
          >
            Hang tight — this takes about 30 seconds.
          </p>
        </motion.div>
      </div>

      {/* Progress stages */}
      <div
        className="space-y-0"
        role="list"
        aria-label="Generation progress"
      >
        {GENERATION_STAGES.map((stage, i) => {
          const isComplete = i < stageIndex;
          const isActive = i === stageIndex;
          const isPending = i > stageIndex;

          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className="flex items-start gap-4"
              role="listitem"
              aria-label={`${stage.label}: ${isComplete ? "completed" : isActive ? "in progress" : "pending"}`}
            >
              {/* Vertical connector + orb */}
              <div
                className="flex flex-col items-center"
                aria-hidden="true"
              >
                <PulsingOrb active={isActive} complete={isComplete} />
                {i < GENERATION_STAGES.length - 1 && (
                  <motion.div
                    className="w-0.5 h-12"
                    style={{
                      background: isComplete
                        ? "var(--teal)"
                        : "var(--border)",
                    }}
                    animate={
                      isComplete
                        ? { background: "var(--teal)" }
                        : {}
                    }
                    transition={{ duration: 0.4 }}
                  />
                )}
              </div>

              {/* Label + description */}
              <div className="pt-2">
                <motion.p
                  className="text-base font-semibold"
                  style={{
                    color: isPending
                      ? "var(--muted)"
                      : "var(--foreground)",
                  }}
                  animate={
                    isActive ? { opacity: [0.7, 1, 0.7] } : {}
                  }
                  transition={
                    isActive
                      ? {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                >
                  {stage.label}
                  {isActive && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      aria-hidden="true"
                    >
                      ...
                    </motion.span>
                  )}
                </motion.p>
                <p
                  className="text-sm mt-0.5"
                  style={{
                    color: isPending
                      ? "var(--muted)"
                      : "var(--foreground)",
                    opacity: isPending ? 0.6 : 0.7,
                  }}
                >
                  {stage.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Animated gradient bar at bottom */}
      <motion.div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--border)" }}
        role="progressbar"
        aria-valuenow={stageIndex + 1}
        aria-valuemin={1}
        aria-valuemax={GENERATION_STAGES.length}
        aria-label={`Generation progress: stage ${stageIndex + 1} of ${GENERATION_STAGES.length}`}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), var(--coral), var(--teal))",
            backgroundSize: "200% 100%",
          }}
          animate={{
            width: `${((stageIndex + 1) / GENERATION_STAGES.length) * 100}%`,
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
          }}
          transition={{
            width: { duration: 0.8, ease: "easeInOut" },
            backgroundPosition: {
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      </motion.div>
    </motion.div>
  );
}
