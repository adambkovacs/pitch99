"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

import { StepIndicator, STEPS } from "@/components/intake/StepIndicator";
import { GeneratingScreen } from "@/components/intake/GeneratingScreen";
import { pageVariants, pageTransition } from "@/components/intake/animations";
import { StepProduct } from "@/components/intake/steps/StepProduct";
import { StepSources } from "@/components/intake/steps/StepSources";
import { StepPitcher } from "@/components/intake/steps/StepPitcher";
import { StepAudience } from "@/components/intake/steps/StepAudience";
import { StepGenerate } from "@/components/intake/steps/StepGenerate";
import type { PitchFormData, GeneratingState } from "@/components/intake/types";
import SmoothScroll from "@/components/SmoothScroll";

export default function IntakePage() {
  const router = useRouter();
  const createPitch = useMutation(api.pitches.create);
  const updatePitch = useMutation(api.pitches.update);
  const generateUploadUrl = useMutation(api.pitches.generateUploadUrl);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [formData, setFormData] = useState<PitchFormData>({
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

  const update = useCallback((patch: Partial<PitchFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  }, []);

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return formData.productName.trim().length > 0 && formData.description.trim().length > 0;
      case 1:
        return true;
      case 2:
        return true;
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

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleGenerate = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    setGenerating({ active: true, stage: "enrich", error: null });
    setDirection(1);
    setStep(5);

    let enrichment: Record<string, unknown> | null = null;
    let research: Record<string, unknown> | null = null;

    try {
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
          signal,
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

      setGenerating((prev) => ({ ...prev, stage: "research" }));

      const researchRes = await fetch("/api/pitch/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: formData.productName,
          productDescription: formData.description,
          audienceType: formData.audience,
        }),
        signal,
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
        signal,
      });

      if (!generateRes.ok) {
        const errBody = await generateRes.json().catch(() => ({}));
        throw new Error(
          (errBody as Record<string, string>).error ||
            `Generation failed (${generateRes.status})`
        );
      }

      const generateData = await generateRes.json();

      localStorage.setItem("pitch99_generated", JSON.stringify({
        productName: formData.productName,
        slides: (generateData as Record<string, unknown>).slides,
        research: research,
        enrichment: enrichment,
        generatedAt: new Date().toISOString(),
      }));

      let uploadedFiles: Array<{ name: string; url: string; type: string }> = [];
      if (formData.files.length > 0) {
        uploadedFiles = await Promise.all(
          formData.files.map(async (file) => {
            const uploadUrl = await generateUploadUrl();
            const result = await fetch(uploadUrl, {
              method: "POST",
              headers: { "Content-Type": file.type },
              body: file,
            });
            const { storageId } = await result.json() as { storageId: string };
            return { name: file.name, url: `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`, type: file.type };
          })
        );
      }

      try {
        const pitchId = await createPitch({
          productName: formData.productName,
          productDescription: formData.description,
          githubUrl: formData.githubUrl.trim() || undefined,
          websiteUrl: formData.websiteUrl.trim() || undefined,
          linkedinUrl: formData.linkedinUrl.trim() || undefined,
          presenterName: undefined,
          presenterBio: formData.bio || undefined,
          audienceType: formData.audience as "investors" | "customers" | "partners" | "general" | "competition",
          desiredOutcome: formData.desiredOutcome || undefined,
          files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        });

        await updatePitch({
          id: pitchId,
          generatedSlides: (generateData as Record<string, unknown>).slides,
          researchData: research,
          enrichedData: enrichment,
          status: "ready",
        });

        setGenerating((prev) => ({ ...prev, active: false }));
        router.push(`/pitch/${pitchId}`);
      } catch {
        setGenerating((prev) => ({ ...prev, active: false }));
        router.push("/pitch/demo");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setGenerating((prev) => ({ ...prev, active: false, error: message }));
    }
  }, [formData, router, createPitch, updatePitch, generateUploadUrl]);

  const handleRetry = useCallback(() => {
    setGenerating({ active: false, stage: "enrich", error: null });
    setStep(4);
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
                  style={{ background: "rgba(249, 115, 22, 0.12)" }}
                >
                  <AlertCircle className="w-8 h-8" style={{ color: "var(--coral)" }} aria-hidden="true" />
                </div>
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                  Generation failed
                </h2>
                <p className="mt-2 text-base max-w-md mx-auto" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                  {generating.error}
                </p>
              </div>
              <motion.button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                style={{ background: "var(--accent)" }}
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
    <SmoothScroll>
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {step <= 4 && <StepIndicator current={Math.min(step, STEPS.length - 1)} total={STEPS.length} />}

      <main
        ref={containerRef}
        className={cn(
          "flex-1 flex items-center justify-center px-6 pb-32",
          step <= 4 ? "pt-24" : "pt-12"
        )}
      >
        <div className="w-full max-w-2xl">
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
          <div className="max-w-2xl mx-auto flex items-center justify-between px-6 py-4">
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
                  !canProceed() && "opacity-50 cursor-not-allowed"
                )}
                style={{
                  background: "linear-gradient(90deg, #f97316, #ef4444)",
                }}
                whileHover={canProceed() ? { scale: 1.02 } : {}}
                whileTap={canProceed() ? { scale: 0.98 } : {}}
                aria-label="Go to next step"
              >
                Next
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            ) : (
              <div className="w-[88px]" />
            )}
          </div>
        </nav>
      )}
    </div>
    </SmoothScroll>
  );
}
