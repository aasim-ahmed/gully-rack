import { Truck } from 'lucide-react'
import { formatPrice } from '../../utils/format'

export function FreeShippingProgress({ subtotal, threshold, remaining }) {
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100))
  return (
    <div className="border border-ink/10 bg-white p-4">
      <p className="flex items-center gap-2 text-xs font-medium">
        <Truck className="size-4 text-blue" aria-hidden="true" />
        {remaining > 0 ? (
          <span>
            Add <strong>{formatPrice(remaining)}</strong> more for free shipping
          </span>
        ) : (
          <span>
            You’ve unlocked <strong>free shipping</strong>
          </span>
        )}
      </p>
      <div
        className="mt-3 h-1 w-full bg-ink/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Progress to free shipping"
      >
        <div className="h-full bg-blue transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/** Totals block shared by cart and checkout. */
export default function OrderSummary({ subtotal, shipping, savings, total, shippingLabel = 'Estimated shipping', children }) {
  return (
    <div>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink/60">Subtotal</dt>
          <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-blue">
            <dt>You save</dt>
            <dd className="font-semibold tabular-nums">−{formatPrice(savings)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-ink/60">{shippingLabel}</dt>
          <dd className="font-semibold tabular-nums">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-ink/10 pt-4">
          <dt className="text-sm font-bold tracking-[0.12em] uppercase">Total</dt>
          <dd className="text-xl font-extrabold tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>
      <p className="mt-1 text-right text-[11px] text-ink/50">Inclusive of all taxes</p>
      {children}
    </div>
  )
}
