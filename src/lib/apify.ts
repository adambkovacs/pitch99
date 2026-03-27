const APIFY_API_URL = "https://api.apify.com/v2";

interface LinkedInProfile {
  firstName?: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  company?: string;
  position?: string;
  location?: string;
  connections?: number;
  experience?: Array<{
    title?: string;
    company?: string;
    duration?: string;
    description?: string;
  }>;
  education?: Array<{
    school?: string;
    degree?: string;
    field?: string;
  }>;
  skills?: string[];
  [key: string]: unknown;
}

export async function lookupLinkedInProfile(
  linkedinUrl: string
): Promise<LinkedInProfile | null> {
  const response = await fetch(
    `${APIFY_API_URL}/acts/anchor~linkedin-profile-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileUrls: [linkedinUrl],
        proxyConfiguration: { useApifyProxy: true },
      }),
    }
  );

  if (!response.ok) {
    console.error("Apify error:", response.status);
    return null;
  }

  const data = await response.json();
  return data[0] ?? null;
}
