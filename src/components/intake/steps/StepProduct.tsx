"use client";

import { motion } from "framer-motion";
import { InputField } from "../InputField";
import { TextareaField } from "../TextareaField";
import { staggerChildren, fadeUp } from "../animations";
import type { PitchFormData } from "../types";

export function StepProduct({
  data,
  update,
}: {
  data: PitchFormData;
  update: (patch: Partial<PitchFormData>) => void;
}) {
  return (
    <motion.div
      variants={staggerChildren}
      initial="enter"
      animate="center"
      className="space-y-8"
    >
      <motion.div variants={fadeUp} className="pb-2">
        <h1
          className="text-4xl sm:text-5xl font-bold leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          What are you{" "}
          <span style={{ color: "var(--accent)" }}>pitching?</span>
        </h1>
        <p
          className="mt-2 text-lg text-zinc-500"
        >
          Tell us about your product or idea. The more detail, the
          better your pitch.
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
