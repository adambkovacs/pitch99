"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileDropZone({
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
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
  });

  const dropzoneDescId = "dropzone-description";

  return (
    <div className="space-y-1.5">
      <label
        className="block text-sm font-medium mb-1.5"
        style={{ color: "var(--foreground)" }}
        id="file-upload-label"
      >
        Supporting files{" "}
        <span style={{ color: "var(--muted)" }}>(optional)</span>
      </label>

      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors duration-200 bg-zinc-50/30",
          "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
        )}
        style={{
          borderColor: isDragActive
            ? "var(--accent)"
            : "#e4e4e7",
          background: isDragActive
            ? "var(--accent-soft)"
            : undefined,
          padding: "2.5rem 1.5rem",
        }}
        aria-labelledby="file-upload-label"
        aria-describedby={dropzoneDescId}
        role="button"
        tabIndex={0}
      >
        <input
          {...getInputProps()}
          aria-label="Upload supporting files"
        />
        <motion.div
          animate={{ y: isDragActive ? -4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto" style={{ marginBottom: "0.75rem" }}>
            <Upload
              className="w-5 h-5"
              style={{
                color: isDragActive ? "var(--accent)" : "var(--muted)",
              }}
              aria-hidden="true"
            />
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {isDragActive
              ? "Drop files here"
              : "Drag & drop files here"}
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
              <X
                className="w-3.5 h-3.5"
                style={{ color: "var(--foreground)" }}
                aria-hidden="true"
              />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
