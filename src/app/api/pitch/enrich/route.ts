import { NextResponse } from "next/server";
import { URL } from "url";
import { lookupLinkedInProfile } from "@/lib/apify";
import { rateLimit } from "@/lib/rateLimit";

// NOTE: DNS rebinding can bypass hostname-only checks. A resolved-IP check
// (e.g. via dns.lookup before fetch) would close that gap but is not yet
// implemented. The patterns below mitigate the most common SSRF vectors.
const BLOCKED_PATTERNS = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
  /^fd00:/,                            // IPv6 ULA
  /^localhost$/i,
  /^metadata\./i,
  /^metadata\.google\.internal$/i,     // GCP metadata
  /^169\.254\.169\.254$/,              // AWS/Azure metadata IP
];

function isAllowedUrl(input: string): boolean {
  try {
    const raw = input.startsWith("http") ? input : `https://${input}`;
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const hostname = url.hostname.toLowerCase();
    if (BLOCKED_PATTERNS.some(p => p.test(hostname))) return false;
    // Block IP addresses that resolve to private ranges
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      if (BLOCKED_PATTERNS.some(p => p.test(hostname))) return false;
    }
    return true;
  } catch {
    return false;
  }
}

interface EnrichRequest {
  githubUrl?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
}

interface EnrichmentResult {
  github: Record<string, unknown> | null;
  website: { title: string; description: string; text: string } | null;
  linkedin: Record<string, unknown> | null;
}

async function fetchGitHubReadme(
  githubUrl: string
): Promise<Record<string, unknown> | null> {
  try {
    // Extract owner/repo from GitHub URL
    const match = githubUrl.match(
      /github\.com\/([^/]+)\/([^/]+)/
    );
    if (!match) return null;

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, "");

    // Fetch repo metadata
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Pitch99",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!repoResponse.ok) {
      console.error("GitHub repo fetch error:", repoResponse.status);
      return null;
    }

    const repoData = await repoResponse.json();

    // Fetch README
    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Pitch99",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
        signal: AbortSignal.timeout(10_000),
      }
    );

    let readmeContent = "";
    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json();
      readmeContent = Buffer.from(
        readmeData.content,
        "base64"
      ).toString("utf-8");
      // Truncate to avoid huge payloads
      if (readmeContent.length > 5000) {
        readmeContent = readmeContent.substring(0, 5000) + "\n...(truncated)";
      }
    }

    return {
      name: repoData.name,
      full_name: repoData.full_name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language,
      topics: repoData.topics,
      open_issues: repoData.open_issues_count,
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      homepage: repoData.homepage,
      readme: readmeContent,
    };
  } catch (error) {
    console.error("GitHub enrichment error:", error);
    return null;
  }
}

async function fetchWebsiteContent(
  websiteUrl: string
): Promise<{ title: string; description: string; text: string } | null> {
  try {
    const url = websiteUrl.startsWith("http")
      ? websiteUrl
      : `https://${websiteUrl}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Pitch99Bot/1.0; +https://pitch99.vercel.app)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error("Website fetch error:", response.status);
      return null;
    }

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch?.[1]?.trim() ?? "";

    // Extract meta description
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i
    );
    const description = descMatch?.[1]?.trim() ?? "";

    // Extract visible text (strip tags, scripts, styles)
    const textContent = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Truncate
    const text =
      textContent.length > 3000
        ? textContent.substring(0, 3000) + "...(truncated)"
        : textContent;

    return { title, description, text };
  } catch (error) {
    console.error("Website enrichment error:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    const { allowed } = rateLimit(ip, 10, 60000);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = (await request.json()) as EnrichRequest;
    let { githubUrl, websiteUrl, linkedinUrl } = body;

    // Input length limits
    if (githubUrl && githubUrl.length > 500) githubUrl = undefined;
    if (websiteUrl && websiteUrl.length > 500) websiteUrl = undefined;
    if (linkedinUrl && linkedinUrl.length > 500) linkedinUrl = undefined;

    // SSRF protection: block private/internal URLs
    if (githubUrl && !isAllowedUrl(githubUrl)) githubUrl = undefined;
    if (githubUrl) {
      try {
        const u = new URL(githubUrl.startsWith("http") ? githubUrl : `https://${githubUrl}`);
        if (u.hostname !== "github.com") githubUrl = undefined;
      } catch {
        githubUrl = undefined;
      }
    }
    if (websiteUrl && !isAllowedUrl(websiteUrl)) {
      websiteUrl = undefined;
    }
    if (linkedinUrl && !isAllowedUrl(linkedinUrl)) {
      linkedinUrl = undefined;
    }

    if (!githubUrl && !websiteUrl && !linkedinUrl) {
      return NextResponse.json(
        { error: "At least one URL must be provided (githubUrl, websiteUrl, or linkedinUrl)" },
        { status: 400 }
      );
    }

    // Run all enrichment tasks in parallel
    const [github, website, linkedin] = await Promise.all([
      githubUrl ? fetchGitHubReadme(githubUrl) : Promise.resolve(null),
      websiteUrl ? fetchWebsiteContent(websiteUrl) : Promise.resolve(null),
      linkedinUrl ? lookupLinkedInProfile(linkedinUrl) : Promise.resolve(null),
    ]);

    const enrichment: EnrichmentResult = {
      github,
      website,
      linkedin,
    };

    return NextResponse.json({ enrichment });
  } catch (error) {
    console.error("[enrich] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
