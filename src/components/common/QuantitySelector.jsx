import { Minus, Plus } from 'lucide-react'
import { cn } from '../../utils/format'

export default function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md', label = 'Quantity' }) {
  const h = { sm: 'h-9', md: 'h-12', lg: 'h-14 sm:h-16' }[size]
  const w = { sm: 'w-9', md: 'w-12', lg: 'w-10 sm:w-12' }[size]
  return (
    <div className={cn('inline-flex items-center border border-ink/15', h)} role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn('flex h-full items-center justify-center transition-colors hover:bg-mist disabled:opacity-30', w)}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </button>
      <span className={cn('flex h-full items-center justify-center text-sm font-semibold tabular-nums', w)} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn('flex h-full items-center justify-center transition-colors hover:bg-mist disabled:opacity-30', w)}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}
