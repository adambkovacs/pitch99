import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { chatCompletion, MODELS } from '@/lib/openrouter'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('chatCompletion', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv, OPENROUTER_API_KEY: 'test-api-key-123' }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('sends correct headers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'response' } }],
      }),
    })

    await chatCompletion({
      model: MODELS.RESEARCH,
      messages: [{ role: 'user', content: 'Hello' }],
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key-123',
          'HTTP-Referer': 'https://pitch99.vercel.app',
          'X-Title': 'Pitch99',
        },
      })
    )
  })

  it('uses correct model in request body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'response' } }],
      }),
    })

    await chatCompletion({
      model: MODELS.AGENTIC,
      messages: [{ role: 'user', content: 'test' }],
    })

    const callArgs = mockFetch.mock.calls[0]
    const body = JSON.parse(callArgs[1].body)

    expect(body.model).toBe('x-ai/grok-4.20-multi-agent-beta')
    expect(body.temperature).toBe(0.7)
    expect(body.max_tokens).toBe(4096)
    expect(body.stream).toBe(false)
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => 'Rate limit exceeded',
    })

    await expect(
      chatCompletion({
        model: MODELS.RESEARCH,
        messages: [{ role: 'user', content: 'Hello' }],
      })
    ).rejects.toThrow('OpenRouter API error: 429 Rate limit exceeded')
  })

  it('returns message content from response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Generated pitch deck content' } }],
      }),
    })

    const result = await chatCompletion({
      model: MODELS.RESEARCH,
      messages: [{ role: 'user', content: 'Generate a pitch' }],
    })

    expect(result).toBe('Generated pitch deck content')
  })
})
