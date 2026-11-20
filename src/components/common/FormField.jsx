import { cn } from '../../utils/format'

/** Labelled input / select / textarea with accessible error wiring. */
export default function FormField({ id, label, error, hint, as = 'input', className, children, optional, ...props }) {
  const Tag = as
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-[11px] font-semibold tracking-[0.12em] uppercase">
        <span>{label}</span>
        {optional && <span className="font-normal tracking-normal text-ink/40 normal-case">Optional</span>}
      </label>
      <Tag
        id={id}
        name={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn('field', as === 'textarea' && 'h-auto min-h-32 py-3', error && 'field-error')}
        {...props}
      >
        {children}
      </Tag>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[11px] text-ink/50">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
