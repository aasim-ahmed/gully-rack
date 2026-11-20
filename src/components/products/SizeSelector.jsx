import { cn } from '../../utils/format'

export default function SizeSelector({ sizes, value, onChange, disabled, error }) {
  return (
    <div role="radiogroup" aria-label="Select size" aria-invalid={!!error} aria-describedby={error ? 'size-error' : undefined}>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const selected = value === s
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(s)}
              className={cn(
                'h-12 min-w-14 border px-4 text-sm font-semibold transition-colors disabled:opacity-40',
                selected ? 'border-ink bg-ink text-white' : 'border-ink/15 hover:border-ink',
                error && !selected && 'border-danger/60',
              )}
            >
              {s}
            </button>
          )
        })}
      </div>
      {error && (
        <p id="size-error" className="mt-2 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
