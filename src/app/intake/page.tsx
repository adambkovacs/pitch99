"use client";

import { useState, useCallback, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  X,
  Github,
  Globe,
  Linkedin,
  Sparkles,
  Check,
  Rocket,
  Users,
  Target,
  Lightbulb,
  AlertCircle,
  Loader2,
} from "lucide-react";

/* ------------------------------------------------------------------
   Types
   ------------------------------------------------------------------ */

interface FormData {
  productName: string;
  description: string;
  githubUrl: string;
  websiteUrl: string;
  files: File[];
  linkedinUrl: string;
  bio: string;
  audience: string;
  desiredOutcome: string;
}

type GeneratingStage = "enrich" | "research" | "generate";

interface GeneratingState {
  active: boolean;
  stage: GeneratingStage;
  error: string | null;
}

const AUDIENCES = [
  { value: "", label: "Select your audience..." },
  { value: "investors", label: "Investors" },
  { value: "customers", label: "Customers" },
  { value: "partners", label: "Partners" },
  { value: "general", label: "General Audience" },
  { value: "competition", label: "Pitch Competition" },
];

const STEPS = [
  { label: "Product", icon: Lightbulb },
  { label: "Sources", icon: FileText },
  { label: "Pitcher", icon: Users },
  { label: "Audience", icon: Target },
  { label: "Generate", icon: Rocket },
];

const GENERATION_STAGES: {
  key: GeneratingStage;
  label: string;
  description: string;
}[] = [
  {
    key: "enrich",
    label: "Analyzing your sources",
    description: "Scraping GitHub, website, and LinkedIn for context...",
  },
  {
    key: "research",
    label: "Researching your market",
    description: "Analyzing TAM, competitors, and ideal customer profiles...",
  },
  {
    key: "generate",
    label: "Generating your pitch",
    description: "Crafting 5 compelling slides tailored to your audience...",
  },
];

/* ------------------------------------------------------------------
   Animation variants
   ------------------------------------------------------------------ */

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.98,
  }),
};

const pageTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

const staggerChildren = {
  center: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const fadeUp = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

/* ------------------------------------------------------------------
   Sub-components
   ------------------------------------------------------------------ */

function StepIndicator({ current, total }: { current: number; total: number }) {
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
        style={{ background: "rgba(250, 250, 249, 0.85)", backdropFilter: "blur(12px)" }}
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
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </motion.div>

              {i < STEPS.length - 1 && (
                <div
                  className="w-6 h-px"
                  style={{
                    background: i < current ? "var(--teal)" : "var(--border)",
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

function InputField({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  type = "text",
  id,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
  type?: string;
  id?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted)" }}
            aria-hidden="true"
          >
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-all duration-200",
            "placeholder:text-[var(--muted)]",
            "focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]",
            Icon && "pl-11"
          )}
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
      </div>
    </div>
  );
}

function TextareaField({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  id,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  id?: string;
}) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="space-y-2">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-all duration-200 resize-none",
          "placeholder:text-[var(--muted)]",
          "focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
        )}
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      />
    </div>
  );
}

function FileDropZone({
  files,
  onDrop,
  onRemove,
}: {
  files: File[];
  onDrop: (accepted: File[]) => void;
  onRemove: (index: number) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
  });

  const dropzoneDescId = "dropzone-description";

  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium"
        style={{ color: "var(--foreground)" }}
        id="file-upload-label"
      >
        Supporting files{" "}
        <span style={{ color: "var(--muted)" }}>(optional)</span>
      </label>

      <div
          {...getRootProps()}
          className={cn(
            "relative rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
          )}
          style={{
            borderColor: isDragActive ? "var(--accent)" : "var(--border)",
            background: isDragActive ? "var(--accent-soft)" : "var(--surface)",
          }}
          aria-labelledby="file-upload-label"
          aria-describedby={dropzoneDescId}
          role="button"
          tabIndex={0}
        >
          <input {...getInputProps()} aria-label="Upload supporting files" />
        <motion.div
          animate={{ y: isDragActive ? -4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Upload
            className="w-8 h-8 mx-auto mb-3"
            style={{ color: isDragActive ? "var(--accent)" : "var(--muted)" }}
            aria-hidden="true"
          />
          <p
            className="text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--muted)" }}
            id={dropzoneDescId}
          >
            PDF, TXT, MD, DOCX, PPTX up to 10 MB (max 5 files)
          </p>
        </motion.div>
      </div>

      {/* File list */}
      <AnimatePresence>
        {files.map((file, i) => (
          <motion.div
            key={`${file.name}-${file.size}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between rounded-lg border px-3 py-2"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText
                className="w-4 h-4 shrink-0"
                style={{ color: "var(--accent)" }}
                aria-hidden="true"
              />
              <span
                className="text-sm truncate"
                style={{ color: "var(--foreground)" }}
              >
                {file.name}
              </span>
              <span
                className="text-xs shrink-0"
                style={{ color: "var(--muted)" }}
              >
                {(file.size / 1024).toFixed(0)} KB
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(i);
              }}
              className="p-2 rounded-md hover:bg-[var(--border)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={`Remove file ${file.name}`}
            >
              <X className="w-3.5 h-3.5" style={{ color: "var(--foreground)" }} aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------
   Generating Progress Screen
   ------------------------------------------------------------------ */

function PulsingOrb({ active, complete }: { active: boolean; complete: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      {active && !complete && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--accent)" }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
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
        animate={active && !complete ? { scale: [1, 1.05, 1] } : {}}
        transition={
          active && !complete
            ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
      >
        {complete ? (
          <Check className="w-5 h-5 text-white" aria-hidden="true" />
        ) : active ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" aria-hidden="true" />
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

function GeneratingScreen({ state }: { state: GeneratingState }) {
  const stageIndex = GENERATION_STAGES.findIndex((s) => s.key === state.stage);

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
          <Sparkles
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "var(--accent)" }}
            aria-hidden="true"
          />
          <h1
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Crafting your{" "}
            <span className="gradient-text">pitch</span>
          </h1>
          <p
            className="mt-3 text-lg"
            style={{ color: "var(--foreground)", opacity: 0.7 }}
          >
            Hang tight — this takes about 30-60 seconds.
          </p>
        </motion.div>
      </div>

      {/* Progress stages */}
      <div className="space-y-0" role="list" aria-label="Generation progress">
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
              <div className="flex flex-col items-center" aria-hidden="true">
                <PulsingOrb active={isActive} complete={isComplete} />
                {i < GENERATION_STAGES.length - 1 && (
                  <motion.div
                    className="w-0.5 h-12"
                    style={{
                      background: isComplete ? "var(--teal)" : "var(--border)",
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
                    isActive
                      ? { opacity: [0.7, 1, 0.7] }
                      : {}
                  }
                  transition={
                    isActive
                      ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      : {}
                  }
                >
                  {stage.label}
                  {isActive && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
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
            background: "linear-gradient(90deg, var(--accent), var(--coral), var(--teal))",
            backgroundSize: "200% 100%",
          }}
          animate={{
            width: `${((stageIndex + 1) / GENERATION_STAGES.length) * 100}%`,
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
          }}
          transition={{
            width: { duration: 0.8, ease: "easeInOut" },
            backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Step Views
   ------------------------------------------------------------------ */

function StepProduct({
  data,
  update,
}: {
  data: FormData;
  update: (patch: Partial<FormData>) => void;
}) {
  return (
    <motion.div variants={staggerChildren} initial="enter" animate="center" className="space-y-8">
      <motion.div variants={fadeUp}>
        <p
          className="text-sm font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--accent)" }}
        >
          Step 1 of 5
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ color: "var(--foreground)" }}>
          What are you{" "}
          <span className="gradient-text">pitching?</span>
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--foreground)", opacity: 0.7 }}>
          Tell us about your product or idea. The more detail, the better your pitch.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <InputField
          label="Product name"
          placeholder="e.g. Pitch99, Stripe, Notion..."
          value={data.productName}
          onChange={(v) => update({ productName: v })}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <TextareaField
          label="Describe it in a few sentences"
          placeholder="What does it do? What problem does it solve? Who is it for?"
          value={data.description}
          onChange={(v) => update({ description: v })}
          rows={5}
        />
      </motion.div>
    </motion.div>
  );
}

function StepSources({
  data,
  update,
}: {
  data: FormData;
  update: (patch: Partial<FormData>) => void;
}) {
  const handleDrop = useCallback(
    (accepted: File[]) => {
      update({ files: [...data.files, ...accepted].slice(0, 5) });
    },
    [data.files, update]
  );

  const handleRemove = useCallback(
    (index: number) => {
      update({ files: data.files.filter((_, i) => i !== index) });
    },
    [data.files, update]
  );

  return (
    <motion.div variants={staggerChildren} initial="enter" animate="center" className="space-y-8">
      <motion.div variants={fadeUp}>
        <p
          className="text-sm font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--accent)" }}
        >
          Step 2 of 5
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ color: "var(--foreground)" }}>
          Your{" "}
          <span className="gradient-text">sources</span>
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--foreground)", opacity: 0.7 }}>
          Help us understand your product better with links and documents.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <InputField
          label="GitHub repository"
          placeholder="https://github.com/your-org/your-repo"
          value={data.githubUrl}
          onChange={(v) => update({ githubUrl: v })}
          icon={Github}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <InputField
          label="Product website"
          placeholder="https://your-product.com"
          value={data.websiteUrl}
          onChange={(v) => update({ websiteUrl: v })}
          icon={Globe}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <FileDropZone
          files={data.files}
          onDrop={handleDrop}
          onRemove={handleRemove}
        />
      </motion.div>
    </motion.div>
  );
}

function StepPitcher({
  data,
  update,
}: {
  data: FormData;
  update: (patch: Partial<FormData>) => void;
}) {
  return (
    <motion.div variants={staggerChildren} initial="enter" animate="center" className="space-y-8">
      <motion.div variants={fadeUp}>
        <p
          className="text-sm font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--accent)" }}
        >
          Step 3 of 5
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ color: "var(--foreground)" }}>
          Who&apos;s{" "}
          <span className="gradient-text">pitching?</span>
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--foreground)", opacity: 0.7 }}>
          A great pitch needs a great pitcher. Tell us a bit about yourself.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <InputField
          label="LinkedIn profile"
          placeholder="https://linkedin.com/in/your-profile"
          value={data.linkedinUrl}
          onChange={(v) => update({ linkedinUrl: v })}
          icon={Linkedin}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <TextareaField
          label="Brief bio"
          placeholder="Your background, expertise, and what makes you the right person to build this..."
          value={data.bio}
          onChange={(v) => update({ bio: v })}
          rows={4}
        />
      </motion.div>
    </motion.div>
  );
}

function StepAudience({
  data,
  update,
}: {
  data: FormData;
  update: (patch: Partial<FormData>) => void;
}) {
  const selectId = useId();

  return (
    <motion.div variants={staggerChildren} initial="enter" animate="center" className="space-y-8">
      <motion.div variants={fadeUp}>
        <p
          className="text-sm font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--accent)" }}
        >
          Step 4 of 5
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ color: "var(--foreground)" }}>
          Your{" "}
          <span className="gradient-text">audience</span>
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--foreground)", opacity: 0.7 }}>
          Knowing who you&apos;re pitching to changes everything.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="space-y-2">
          <label
            htmlFor={selectId}
            className="block text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Who are you pitching to?
          </label>
          <select
            id={selectId}
            value={data.audience}
            onChange={(e) => update({ audience: e.target.value })}
            className={cn(
              "w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-all duration-200 appearance-none",
              "focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]",
              !data.audience && "text-[var(--muted)]"
            )}
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: data.audience ? "var(--foreground)" : "var(--muted)",
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

function StepGenerate({
  data,
  onGenerate,
  isGenerating,
}: {
  data: FormData;
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
      value: data.files.length > 0 ? data.files.map((f) => f.name).join(", ") : "",
      accent: false,
    },
    { label: "LinkedIn", value: data.linkedinUrl, accent: true },
    { label: "Bio", value: data.bio, accent: false },
    {
      label: "Audience",
      value: AUDIENCES.find((a) => a.value === data.audience)?.label ?? "",
      accent: false,
    },
    { label: "Desired outcome", value: data.desiredOutcome, accent: false },
  ].filter((item) => item.value);

  return (
    <motion.div variants={staggerChildren} initial="enter" animate="center" className="space-y-8">
      <motion.div variants={fadeUp}>
        <p
          className="text-sm font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--coral)" }}
        >
          Step 5 of 5
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ color: "var(--foreground)" }}>
          Ready to{" "}
          <span className="gradient-text">generate</span>
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--foreground)", opacity: 0.7 }}>
          Review your inputs below, then let the magic happen.
        </p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="px-6 py-4 border-b"
          style={{
            borderColor: "var(--border)",
            background: "var(--accent-soft)",
          }}
        >
          <h3 className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
            Pitch Summary
          </h3>
        </div>
        <dl className="divide-y" style={{ borderColor: "var(--border)" }}>
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="px-6 py-3.5 flex gap-4"
              style={{ borderColor: "var(--border)" }}
            >
              <dt
                className="text-sm font-medium w-28 shrink-0"
                style={{ color: "var(--foreground)", opacity: 0.7 }}
              >
                {item.label}
              </dt>
              <dd
                className={cn(
                  "text-sm break-all",
                  item.accent && "font-mono text-xs"
                )}
                style={{
                  color: item.accent ? "var(--accent)" : "var(--foreground)",
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
            isGenerating ? "cursor-not-allowed opacity-70" : "cursor-pointer"
          )}
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--coral))",
          }}
          whileHover={isGenerating ? {} : { scale: 1.01, boxShadow: "0 8px 30px rgba(249, 115, 22, 0.25)" }}
          whileTap={isGenerating ? {} : { scale: 0.98 }}
          aria-label="Generate my pitch deck"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            Generate My Pitch
          </span>
        </motion.button>
        <p
          className="text-center text-xs mt-3"
          style={{ color: "var(--muted)" }}
        >
          Your 99-second pitch deck will be ready in about 60 seconds.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Main Intake Page
   ------------------------------------------------------------------ */

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    productName: "",
    description: "",
    githubUrl: "",
    websiteUrl: "",
    files: [],
    linkedinUrl: "",
    bio: "",
    audience: "",
    desiredOutcome: "",
  });

  const [generating, setGenerating] = useState<GeneratingState>({
    active: false,
    stage: "enrich",
    error: null,
  });

  const update = useCallback((patch: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  }, []);

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return formData.productName.trim().length > 0;
      case 1:
        return true; // all optional
      case 2:
        return true; // all optional
      case 3:
        return formData.audience.length > 0;
      case 4:
        return true;
      default:
        return true;
    }
  }, [step, formData]);

  const goNext = useCallback(() => {
    if (step < STEPS.length - 1 && canProceed()) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step, canProceed]);

  const goBack = useCallback(() => {
    if (step > 0 && !generating.active) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step, generating.active]);

  /* ----------------------------------------------------------------
     Pitch generation pipeline
     ---------------------------------------------------------------- */

  const handleGenerate = useCallback(async () => {
    setGenerating({ active: true, stage: "enrich", error: null });
    setDirection(1);
    setStep(5); // Move to generating screen

    let enrichment: Record<string, unknown> | null = null;
    let research: Record<string, unknown> | null = null;

    try {
      // --- Step 1: Enrich (only if user provided URLs) ---
      const hasUrls =
        formData.githubUrl.trim() ||
        formData.websiteUrl.trim() ||
        formData.linkedinUrl.trim();

      if (hasUrls) {
        const enrichRes = await fetch("/api/pitch/enrich", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            githubUrl: formData.githubUrl.trim() || undefined,
            websiteUrl: formData.websiteUrl.trim() || undefined,
            linkedinUrl: formData.linkedinUrl.trim() || undefined,
          }),
        });

        if (!enrichRes.ok) {
          const errBody = await enrichRes.json().catch(() => ({}));
          throw new Error(
            (errBody as Record<string, string>).error ||
              `Enrichment failed (${enrichRes.status})`
          );
        }

        const enrichData = await enrichRes.json();
        enrichment = (enrichData as { enrichment: Record<string, unknown> }).enrichment;
      }

      // --- Step 2: Research ---
      setGenerating((prev) => ({ ...prev, stage: "research" }));

      const researchRes = await fetch("/api/pitch/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: formData.productName,
          productDescription: formData.description,
          audienceType: formData.audience,
        }),
      });

      if (!researchRes.ok) {
        const errBody = await researchRes.json().catch(() => ({}));
        throw new Error(
          (errBody as Record<string, string>).error ||
            `Research failed (${researchRes.status})`
        );
      }

      const researchData = await researchRes.json();
      research = (researchData as { research: Record<string, unknown> }).research;

      // --- Step 3: Generate slides ---
      setGenerating((prev) => ({ ...prev, stage: "generate" }));

      const generateRes = await fetch("/api/pitch/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: formData.productName,
          productDescription: formData.description,
          audienceType: formData.audience,
          askAmount: formData.desiredOutcome,
          research: research ?? undefined,
          enrichment: enrichment ?? undefined,
        }),
      });

      if (!generateRes.ok) {
        const errBody = await generateRes.json().catch(() => ({}));
        throw new Error(
          (errBody as Record<string, string>).error ||
            `Generation failed (${generateRes.status})`
        );
      }

      // Success — redirect to the demo viewer
      router.push("/pitch/demo");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setGenerating((prev) => ({ ...prev, active: false, error: message }));
      // Stay on step 5 so user sees the error with a retry option
    }
  }, [formData, router]);

  const handleRetry = useCallback(() => {
    setGenerating({ active: false, stage: "enrich", error: null });
    setStep(4); // Go back to the review step
  }, []);

  /* ----------------------------------------------------------------
     Render
     ---------------------------------------------------------------- */

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepProduct data={formData} update={update} />;
      case 1:
        return <StepSources data={formData} update={update} />;
      case 2:
        return <StepPitcher data={formData} update={update} />;
      case 3:
        return <StepAudience data={formData} update={update} />;
      case 4:
        return (
          <StepGenerate
            data={formData}
            onGenerate={handleGenerate}
            isGenerating={generating.active}
          />
        );
      case 5:
        // Generating / error state
        if (generating.error) {
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 text-center"
              role="alert"
              aria-live="assertive"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: "var(--coral)", opacity: 0.15 }}
                >
                  <AlertCircle
                    className="w-8 h-8"
                    style={{ color: "var(--coral)" }}
                    aria-hidden="true"
                  />
                </div>
              </motion.div>

              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  Generation failed
                </h2>
                <p
                  className="mt-2 text-base max-w-md mx-auto"
                  style={{ color: "var(--foreground)", opacity: 0.7 }}
                >
                  {generating.error}
                </p>
              </div>

              <motion.button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                style={{
                  background: "var(--accent)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Go back and try again
              </motion.button>
            </motion.div>
          );
        }
        return <GeneratingScreen state={generating} />;
      default:
        return null;
    }
  };

  const showNav = step <= 4 && !generating.active;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--background)" }}
    >
      {step <= 4 && <StepIndicator current={Math.min(step, STEPS.length - 1)} total={STEPS.length} />}

      {/* Main content area */}
      <main
        ref={containerRef}
        className={cn(
          "flex-1 flex items-center justify-center px-6 pb-32",
          step <= 4 ? "pt-24" : "pt-12"
        )}
      >
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom navigation */}
      {showNav && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            background: "rgba(250, 250, 249, 0.85)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid var(--border)",
          }}
          aria-label="Step navigation"
        >
          <div className="max-w-xl mx-auto flex items-center justify-between px-6 py-4">
            <motion.button
              onClick={goBack}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer min-h-[44px]",
                "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2",
                step === 0 && "opacity-0 pointer-events-none"
              )}
              style={{
                color: "var(--foreground)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Go to previous step"
              aria-disabled={step === 0}
              tabIndex={step === 0 ? -1 : 0}
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back
            </motion.button>

            {/* Step count */}
            <span
              className="text-xs font-mono"
              style={{ color: "var(--muted)" }}
              aria-live="polite"
              aria-atomic="true"
            >
              {step + 1}/{STEPS.length}
            </span>

            {step < STEPS.length - 1 ? (
              <motion.button
                onClick={goNext}
                disabled={!canProceed()}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white cursor-pointer transition-opacity duration-200 min-h-[44px]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2",
                  !canProceed() && "opacity-40 cursor-not-allowed"
                )}
                style={{
                  background: "var(--accent)",
                }}
                whileHover={canProceed() ? { scale: 1.02 } : {}}
                whileTap={canProceed() ? { scale: 0.98 } : {}}
                aria-label="Go to next step"
              >
                Next
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            ) : (
              <div className="w-[88px]" /> // Spacer to keep layout balanced on last step
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
