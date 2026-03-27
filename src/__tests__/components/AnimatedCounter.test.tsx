import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AnimatedCounter from '@/components/slides/AnimatedCounter'

// Mock framer-motion
const mockAnimate = vi.fn((_motionValue, _target, options) => {
  // Immediately call onUpdate with the target value to simulate completed animation
  if (options?.onUpdate) {
    options.onUpdate(_target)
  }
  return { stop: vi.fn() }
})

const mockUseMotionValue = vi.fn((initial: number) => ({
  get: () => initial,
  set: vi.fn(),
}))

const mockUseTransform = vi.fn((_value, transform) => ({
  get: () => transform(0),
}))

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...props}>{children}</span>
    ),
  },
  useMotionValue: (initial: number) => mockUseMotionValue(initial),
  useTransform: (_value: unknown, transform: (v: number) => string) => mockUseTransform(_value, transform),
  animate: (...args: Parameters<typeof mockAnimate>) => mockAnimate(...args),
}))

describe('AnimatedCounter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  it('renders with initial value', () => {
    render(<AnimatedCounter from={0} to={100} />)

    // Initial display should show "0" (from.toFixed(0))
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders prefix and suffix', () => {
    const { container } = render(<AnimatedCounter from={0} to={100} prefix="$" suffix="M" />)

    // The outermost rendered span contains prefix + value + suffix
    const span = container.querySelector('span')
    expect(span).toHaveTextContent('$0M')
  })

  it('displays final value after animation', () => {
    render(<AnimatedCounter from={0} to={42} />)

    // Advance timers to trigger the setTimeout(delay=0) and animation
    act(() => {
      vi.runAllTimers()
    })

    // mockAnimate calls onUpdate with the target value (42)
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
