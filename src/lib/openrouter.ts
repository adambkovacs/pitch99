const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterOptions {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export async function chatCompletion(
  options: OpenRouterOptions
): Promise<string> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://pitch99.vercel.app",
      "X-Title": "Pitch99",
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 4096,
      stream: options.stream ?? false,
    }),
    signal: AbortSignal.timeout(90000),
  });

  if (!response.ok) {
    throw new Error(
      `OpenRouter API error: ${response.status} ${await response.text()}`
    );
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export const MODELS = {
  AGENTIC: "x-ai/grok-4.20-multi-agent-beta",
  RESEARCH: "perplexity/sonar-pro-search",
} as const;
