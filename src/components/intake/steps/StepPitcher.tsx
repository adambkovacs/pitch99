"use client";

import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { InputField } from "../InputField";
import { TextareaField } from "../TextareaField";
import { staggerChildren, fadeUp } from "../animations";
import type { PitchFormData } from "../types";

export function StepPitcher({
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
        <p
          className="text-sm font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--accent)" }}
        >
          Step 3 of 5
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          Who&apos;s{" "}
          <span style={{ color: "var(--accent)" }}>pitching?</span>
        </h1>
        <p
          className="mt-2 text-lg text-zinc-500"
        >
          A great pitch needs a great pitcher. Tell us a bit about
          yourself.
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
