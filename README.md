# Pitch99

### You have 99 problems. But this p*tch ain't one.

> AI-powered pitch generator that transforms your product into a polished 99-second pitch presentation -- complete with market research, animated slides, talking points, and Q&A prep.

[![Live](https://img.shields.io/badge/Live-pitch99.help-orange?style=for-the-badge)](https://pitch99.help)
[![GitHub](https://img.shields.io/badge/GitHub-adambkovacs%2Fpitch99-black?style=for-the-badge&logo=github)](https://github.com/adambkovacs/pitch99)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

![Pitch99 Hero](docs/screenshots/hero.png)

---

## The Problem

Founders spend **40+ hours** building pitch decks. They pitch **40 times** on average before closing a round. Investors spend just **2 minutes and 24 seconds** reviewing each deck. And **97% of pitches fail** to get funded.

Different audiences need different pitches -- investors, customers, partners. Every. Single. Time.

## The Solution

Pitch99 takes the painful, 40+ hour process and compresses it into **minutes**. You bring your product. Pitch99 brings the research, the story, the slides, and the confidence.

**How it works:**

1. **Intake** -- Drop your GitHub repo, website URL, LinkedIn, or upload docs
2. **Enrichment** -- AI scrapes and analyzes your product, founder profile, and branding
3. **Research** -- Live market research: TAM/SAM/SOM, competitors, ICP, industry trends
4. **Generation** -- 5 animated HTML slides with talking points, timing cues, and Q&A prep

---

## Built Live at Founders Live

This project was built from scratch in **2 hours** at [Founders Live Build: Seattle](https://www.founderslive.com) on March 26, 2026. Five builders had 2 hours to vibecode an app using AI tools, then pitch it in 99 seconds to the audience.

**Builder:** [Adam Kovacs](https://www.linkedin.com/in/adambkovacs/) -- Co-founder, AI Enablement Academy

---

## Features

| Feature | Description |
|---------|-------------|
| **Multi-source intake** | GitHub repo, product website, LinkedIn profile, file uploads (PDF, DOCX, PPTX) |
| **AI market research** | TAM/SAM/SOM analysis, competitor mapping, ICP definition via Perplexity Sonar Pro |
| **Animated HTML slides** | 5 slides optimized for 99-second delivery, animated with GSAP + Framer Motion |
| **Talking points** | Per-slide scripts with timing cues for confident delivery |
| **Q&A preparation** | Anticipated audience questions with suggested answers |
| **Shareable links** | Each generated pitch gets a unique URL to share with anyone |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 16, React 19 | Full-stack app |
| Styling | Tailwind CSS 4, Framer Motion, GSAP | Design + animations |
| Database | Convex | Real-time backend-as-a-service |
| AI -- Agentic | Grok 4.20 Multi-Agent (via OpenRouter) | Narrative + slide generation |
| AI -- Research | Perplexity Sonar Pro Search (via OpenRouter) | Market research |
| Enrichment | Apify | LinkedIn profile scraping |
| Hosting | Vercel | Deployment + CI/CD |

---

## Getting Started

```bash
git clone https://github.com/adambkovacs/pitch99.git
cd pitch99
pnpm install
cp .env.example .env  # Add your API keys
pnpm dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENROUTER_API_KEY` | API key for OpenRouter (routes to Grok + Perplexity) |
| `APIFY_API_KEY` | API key for Apify LinkedIn scraping |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `CONVEX_DEPLOYMENT` | Convex deployment identifier |

---

## Project Structure

```
src/
  app/
    page.tsx                    # Pitch slide presentation (homepage)
    intake/page.tsx             # Multi-step intake form
    pitch/demo/page.tsx         # Dynamic pitch viewer
    api/pitch/
      enrich/route.ts           # GitHub + website + LinkedIn enrichment
      research/route.ts         # Market research via Perplexity
      generate/route.ts         # Slide generation via Grok
  components/
    slides/
      SlidePresentation.tsx     # Horizontal slide navigator
      SlideTemplate.tsx         # Reusable slide building blocks
      Pitch99Slides.tsx         # The pitch about Pitch99 itself
      MarketChart.tsx           # Animated bar charts
      AnimatedCounter.tsx       # Number counting animation
  lib/
    openrouter.ts               # OpenRouter API client
    apify.ts                    # Apify LinkedIn client
convex/
  schema.ts                     # Database schema (pitches table)
  pitches.ts                    # Queries + mutations
docs/
  plans/PRD.md                  # Product Requirements Document
  plans/DEV-PLAN.md             # Phased dev plan (65 tasks, 6 phases)
  adr/                          # 4 Architecture Decision Records
  TALKING-POINTS.md             # Full 99-second pitch script + FAQ
  CUE-CARD.md                   # Condensed presenter cue card
```

---

## Development

```bash
pnpm dev          # Dev server (Turbopack)
pnpm build        # Production build
pnpm test         # Run tests (19 tests, Vitest)
pnpm lint         # Lint (ESLint)
```

### Tests

4 test files, London School approach (mock at boundaries):

| Test | Coverage |
|------|----------|
| `SlidePresentation.test.tsx` | Navigation, keyboard, touch, progress bar |
| `AnimatedCounter.test.tsx` | Number animation, prefix/suffix |
| `MarketChart.test.tsx` | Chart rendering, data display |
| `openrouter.test.ts` | API client, headers, error handling |

---

## Links

- **Live app:** [pitch99.help](https://pitch99.help)
- **GitHub:** [github.com/adambkovacs/pitch99](https://github.com/adambkovacs/pitch99)
- **Founders Live:** [founderslive.com](https://www.founderslive.com)
- **Builder:** [linkedin.com/in/adambkovacs](https://www.linkedin.com/in/adambkovacs/)

---

## License

[MIT](LICENSE)
