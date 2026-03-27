# Pitch99

**You have 99 problems. But this pitch ain't one.**

Pitch99 is an AI-powered pitch generator that transforms your product into a polished, 99-second pitch presentation -- complete with market research, animated HTML slides, talking points, and Q&A prep.

**Live:** [pitch99.vercel.app](https://pitch99.vercel.app)
**Source:** [github.com/adambkovacs/pitch99](https://github.com/adambkovacs/pitch99)

---

## What is Pitch99?

Pitch99 takes the painful, 40+ hour process of creating a pitch deck and compresses it into minutes. You bring your product. Pitch99 brings the research, the story, the slides, and the confidence.

Built live at **Founders Live Build: Seattle** (March 26, 2026) in 2 hours.

The system ingests your product from multiple sources (GitHub, website, LinkedIn, docs), researches your market using live web search, and generates beautiful animated HTML slide presentations calibrated to exactly 99 seconds -- with talking points and timing cues for each slide.

---

## Features

- **Multi-source intake** -- GitHub repo URL, product website, LinkedIn profile, file uploads (PDF, DOCX, PPTX), or free-text description
- **AI-powered market research** -- TAM/SAM/SOM analysis, competitor mapping, industry trends, and ICP definition via Perplexity Sonar Pro Search
- **Animated HTML slides** -- 5 slides optimized for 99-second delivery, animated with GSAP and Framer Motion
- **Talking points and timing** -- Per-slide scripts with timing cues so you nail the delivery
- **Q&A preparation** -- Anticipated audience questions with suggested answers
- **Shareable via URL** -- Each generated pitch gets a unique link you can share with anyone

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 16, React 19 | App framework |
| Styling | Tailwind CSS 4, Framer Motion, GSAP | Design and animations |
| Database | Convex | Real-time backend |
| AI (Agentic) | Grok 4.20 Multi-Agent via OpenRouter | Narrative and slide generation |
| AI (Research) | Perplexity Sonar Pro Search via OpenRouter | Market research, TAM/SAM/SOM |
| Enrichment | Apify | LinkedIn profile scraping |
| Deployment | Vercel | Hosting and CI/CD |

---

## Architecture

Pitch99 runs a 4-stage agentic pipeline, with each stage orchestrating specialized AI agents behind the scenes.

1. **Intake** -- User provides product info through a multi-step form: URLs, file uploads, or free-text description.
2. **Enrichment** -- System scrapes and analyzes GitHub README, website content, and LinkedIn profiles via Apify.
3. **Research** -- Perplexity Sonar Pro Search performs live market research: TAM/SAM/SOM sizing, competitor mapping, industry trends, and customer segmentation.
4. **Generation** -- Grok 4.20 Multi-Agent generates 5 animated HTML slides with talking points, timing cues, and anticipated Q&A.

---

## Getting Started

```bash
git clone https://github.com/adambkovacs/pitch99.git
cd pitch99
pnpm install
cp .env.example .env  # Add your API keys
pnpm dev
```

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENROUTER_API_KEY` | API key for OpenRouter (Grok + Perplexity) |
| `APIFY_API_KEY` | API key for Apify LinkedIn scraping |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `CONVEX_DEPLOYMENT` | Convex deployment identifier |

---

## Project Structure

```
src/
  app/
    page.tsx                    # Pitch slide presentation (homepage)
    layout.tsx                  # Root layout
    intake/page.tsx             # Multi-step intake form
    pitch/demo/page.tsx         # Dynamic pitch viewer
    api/pitch/
      enrich/route.ts           # GitHub + website + LinkedIn enrichment
      research/route.ts         # Market research via Perplexity
      generate/route.ts         # Slide generation via Grok
  components/
    ConvexProvider.tsx           # Convex client provider
    slides/
      SlidePresentation.tsx      # Horizontal slide navigation
      SlideTemplate.tsx          # Reusable slide building blocks
      Pitch99Slides.tsx          # The pitch about Pitch99 itself
      MarketChart.tsx            # Animated bar charts
      AnimatedCounter.tsx        # Number counting animation
  lib/
    openrouter.ts               # OpenRouter API client
    apify.ts                    # Apify LinkedIn client
    utils.ts                    # Tailwind utilities
  __tests__/
    api/openrouter.test.ts      # OpenRouter client tests
    components/
      SlidePresentation.test.tsx
      AnimatedCounter.test.tsx
      MarketChart.test.tsx
convex/
  schema.ts                     # Database schema
  pitches.ts                    # Queries and mutations
docs/
  plans/PRD.md                  # Product Requirements Document
  plans/DEV-PLAN.md             # Phased development plan
  adr/                          # Architecture Decision Records
  TALKING-POINTS.md             # 99-second pitch script
  CUE-CARD.md                   # Condensed presenter cue card
```

---

## Development

```bash
pnpm dev          # Start dev server (Next.js Turbopack)
pnpm build        # Production build
pnpm test         # Run tests (Vitest)
pnpm lint         # Lint (ESLint)
```

---

## Testing

The project includes 4 test files using Vitest with Testing Library, following the London School approach (mock dependencies at boundaries).

| Test File | Coverage |
|-----------|----------|
| `SlidePresentation.test.tsx` | Slide navigation, keyboard controls, touch events |
| `AnimatedCounter.test.tsx` | Number animation, formatting |
| `MarketChart.test.tsx` | Chart rendering, data display |
| `openrouter.test.ts` | API client, error handling, model constants |

```bash
pnpm test         # Run all tests
pnpm test:ui      # Run tests with Vitest UI
```

---

## Built at Founders Live

This project was built live at **Founders Live Build: Seattle** on March 26, 2026. Five builders had 2 hours to vibecode an app from scratch using AI tools, then pitch it in 99 seconds to the audience.

**Builder:** Adam Kovacs -- Co-founder, AI Enablement Academy

---

## License

MIT
