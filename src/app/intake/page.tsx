"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
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
      <div
        className="flex items-center justify-center gap-2 py-4 px-6"
        style={{ background: "rgba(250, 250, 249, 0.85)", backdropFilter: "blur(12px)" }}
      >
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === current;
          const isComplete = i < current;

          return (
            <div key={step.label} className="flex items-center gap-2">
              <motion.div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-300",
                  isActive && "text-white",
                  isComplete && "text-white",
                  !isActive && !isComplete && "text-[var(--muted-light)]"
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
              >
                {isComplete ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </motion.div>

              {i < STEPS.length - 1 && (
                <div
                  className="w-6 h-px"
                  style={{
                    background: i < current ? "var(--teal)" : "var(--border)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
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
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted-light)" }}
          >
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-all duration-200",
            "placeholder:text-[var(--muted-light)]",
            "focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]",
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
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-all duration-200 resize-none",
          "placeholder:text-[var(--muted-light)]",
          "focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
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

  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium"
        style={{ color: "var(--foreground)" }}
      >
        Supporting files{" "}
        <span style={{ color: "var(--muted-light)" }}>(optional)</span>
      </label>

      <div
          {...getRootProps()}
          className={cn(
            "relative rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors duration-200"
          )}
          style={{
            borderColor: isDragActive ? "var(--accent)" : "var(--border)",
            background: isDragActive ? "var(--accent-soft)" : "var(--surface)",
          }}
        >
          <input {...getInputProps()} />
        <motion.div
          animate={{ y: isDragActive ? -4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Upload
            className="w-8 h-8 mx-auto mb-3"
            style={{ color: isDragActive ? "var(--accent)" : "var(--muted-light)" }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--muted-light)" }}
          >
            PDF, TXT, MD, DOCX, PPTX up to 10 MB
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
              />
              <span
                className="text-sm truncate"
                style={{ color: "var(--foreground)" }}
              >
                {file.name}
              </span>
              <span
                className="text-xs shrink-0"
                style={{ color: "var(--muted-light)" }}
              >
                {(file.size / 1024).toFixed(0)} KB
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(i);
              }}
              className="p-1 rounded-md hover:bg-[var(--border)] transition-colors"
            >
              <X className="w-3.5 h-3.5" style={{ color: "var(--muted)" }} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
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
        <p className="mt-3 text-lg" style={{ color: "var(--muted)" }}>
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
        <p className="mt-3 text-lg" style={{ color: "var(--muted)" }}>
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
        <p className="mt-3 text-lg" style={{ color: "var(--muted)" }}>
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
        <p className="mt-3 text-lg" style={{ color: "var(--muted)" }}>
          Knowing who you&apos;re pitching to changes everything.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="space-y-2">
          <label
            className="block text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Who are you pitching to?
          </label>
          <select
            value={data.audience}
            onChange={(e) => update({ audience: e.target.value })}
            className={cn(
              "w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-all duration-200 appearance-none",
              "focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]",
              !data.audience && "text-[var(--muted-light)]"
            )}
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: data.audience ? "var(--foreground)" : "var(--muted-light)",
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

function StepGenerate({ data }: { data: FormData }) {
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
        <p className="mt-3 text-lg" style={{ color: "var(--muted)" }}>
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
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="px-6 py-3.5 flex gap-4"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="text-sm font-medium w-28 shrink-0"
                style={{ color: "var(--muted)" }}
              >
                {item.label}
              </span>
              <span
                className={cn(
                  "text-sm break-all",
                  item.accent && "font-mono text-xs"
                )}
                style={{
                  color: item.accent ? "var(--accent)" : "var(--foreground)",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Generate button */}
      <motion.div variants={fadeUp}>
        <motion.button
          className="w-full py-4 rounded-xl text-white text-lg font-semibold cursor-pointer relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--coral))",
          }}
          whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(124, 58, 237, 0.25)" }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate My Pitch
          </span>
        </motion.button>
        <p
          className="text-center text-xs mt-3"
          style={{ color: "var(--muted-light)" }}
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
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

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
        return <StepGenerate data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--background)" }}
    >
      <StepIndicator current={step} total={STEPS.length} />

      {/* Main content area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center px-6 pt-24 pb-32"
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
      </div>

      {/* Bottom navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "rgba(250, 250, 249, 0.85)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="max-w-xl mx-auto flex items-center justify-between px-6 py-4">
          <motion.button
            onClick={goBack}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer",
              step === 0 && "opacity-0 pointer-events-none"
            )}
            style={{
              color: "var(--muted)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>

          {/* Step count */}
          <span
            className="text-xs font-mono"
            style={{ color: "var(--muted-light)" }}
          >
            {step + 1}/{STEPS.length}
          </span>

          {step < STEPS.length - 1 ? (
            <motion.button
              onClick={goNext}
              disabled={!canProceed()}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer transition-opacity duration-200",
                !canProceed() && "opacity-40 cursor-not-allowed"
              )}
              style={{
                background: "var(--accent)",
              }}
              whileHover={canProceed() ? { scale: 1.02 } : {}}
              whileTap={canProceed() ? { scale: 0.98 } : {}}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <div className="w-[88px]" /> // Spacer to keep layout balanced on last step
          )}
        </div>
      </div>
    </div>
  );
}
