import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SlidePresentation, { type SlideData } from '@/components/slides/SlidePresentation'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }) => (
      <div className={className} style={style} {...props}>{children}</div>
    ),
    span: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock gsap
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
  },
}))

const mockSlides: SlideData[] = [
  { id: 1, content: <div>Slide 1 Content</div> },
  { id: 2, content: <div>Slide 2 Content</div> },
  { id: 3, content: <div>Slide 3 Content</div> },
  { id: 4, content: <div>Slide 4 Content</div> },
  { id: 5, content: <div>Slide 5 Content</div> },
]

describe('SlidePresentation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correct number of navigation dots', () => {
    render(<SlidePresentation slides={mockSlides} />)

    const dots = screen.getAllByRole('button', { name: /Go to slide/i })
    expect(dots).toHaveLength(5)
  })

  it('advances to next slide on ArrowRight keydown', () => {
    render(<SlidePresentation slides={mockSlides} />)

    // Initially shows slide 01
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Slide 1 Content')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'ArrowRight' })

    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('Slide 2 Content')).toBeInTheDocument()
  })

  it('goes back on ArrowLeft keydown', () => {
    render(<SlidePresentation slides={mockSlides} />)

    // Go forward first
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('02')).toBeInTheDocument()

    // Then go back
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Slide 1 Content')).toBeInTheDocument()
  })

  it('does not go past the last slide', () => {
    render(<SlidePresentation slides={mockSlides} />)

    // Navigate to the last slide
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(window, { key: 'ArrowRight' })
    }

    // Should be clamped at slide 5 — both current and total show "05",
    // so check the current counter specifically via its class
    const currentCounter = document.querySelector('.text-orange-600.font-bold')
    expect(currentCounter).toHaveTextContent('05')
    expect(screen.getByText('Slide 5 Content')).toBeInTheDocument()
  })

  it('does not go before the first slide', () => {
    render(<SlidePresentation slides={mockSlides} />)

    // Try to go back from the first slide
    fireEvent.keyDown(window, { key: 'ArrowLeft' })

    // Should still be at slide 1
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Slide 1 Content')).toBeInTheDocument()
  })

  it('shows progress bar', () => {
    const { container } = render(<SlidePresentation slides={mockSlides} />)

    // The progress bar container has class h-1 bg-zinc-100
    const progressContainer = container.querySelector('.h-1.bg-zinc-100')
    expect(progressContainer).toBeInTheDocument()

    // The inner gradient bar exists
    const progressBar = progressContainer?.firstElementChild
    expect(progressBar).toBeInTheDocument()
  })

  it('displays slide counter in 01/05 format', () => {
    render(<SlidePresentation slides={mockSlides} />)

    // Current slide number (bold orange)
    expect(screen.getByText('01')).toBeInTheDocument()
    // Separator
    expect(screen.getByText('/')).toBeInTheDocument()
    // Total slides
    expect(screen.getByText('05')).toBeInTheDocument()
  })
})
