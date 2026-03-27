"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Github, Globe } from "lucide-react";
import { InputField } from "../InputField";
import { FileDropZone } from "../FileDropZone";
import { staggerChildren, fadeUp } from "../animations";
import type { PitchFormData } from "../types";

export function StepSources({
  data,
  update,
}: {
  data: PitchFormData;
  update: (patch: Partial<PitchFormData>) => void;
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
    <motion.div
      variants={staggerChildren}
      initial="enter"
      animate="center"
      className="space-y-8"
    >
      <motion.div variants={fadeUp} className="pb-2">
        <p
          className="text-sm font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--accent)" }}
        >
          Step 2 of 5
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          Your{" "}
          <span style={{ color: "var(--accent)" }}>sources</span>
        </h1>
        <p
          className="mt-2 text-lg text-zinc-500"
        >
          Help us understand your product better with links and
          documents.
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
