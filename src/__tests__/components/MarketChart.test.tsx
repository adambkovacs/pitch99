import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MarketChart from '@/components/slides/MarketChart'

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
}))

const mockData = [
  { label: 'Enterprise', value: 45 },
  { label: 'SMB', value: 30 },
  { label: 'Startup', value: 25 },
]

describe('MarketChart', () => {
  it('renders title when provided', () => {
    render(<MarketChart data={mockData} title="Market Segments" />)

    expect(screen.getByText('Market Segments')).toBeInTheDocument()
  })

  it('does not render title when not provided', () => {
    const { container } = render(<MarketChart data={mockData} />)

    const heading = container.querySelector('h3')
    expect(heading).not.toBeInTheDocument()
  })

  it('renders all data labels', () => {
    render(<MarketChart data={mockData} />)

    expect(screen.getByText('Enterprise')).toBeInTheDocument()
    expect(screen.getByText('SMB')).toBeInTheDocument()
    expect(screen.getByText('Startup')).toBeInTheDocument()
  })

  it('renders all data values with suffix', () => {
    render(<MarketChart data={mockData} suffix="%" />)

    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
  })

  it('renders data values without suffix when not provided', () => {
    render(<MarketChart data={mockData} />)

    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })
})
