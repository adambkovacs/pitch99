export interface PitchFormData {
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

export type GeneratingStage = "enrich" | "research" | "generate";

export interface GeneratingState {
  active: boolean;
  stage: GeneratingStage;
  error: string | null;
}

export const AUDIENCES = [
  { value: "", label: "Select your audience..." },
  { value: "investors", label: "Investors" },
  { value: "customers", label: "Customers" },
  { value: "partners", label: "Partners" },
  { value: "general", label: "General Audience" },
  { value: "competition", label: "Pitch Competition" },
];
