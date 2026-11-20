import { discountPercent, formatPrice, cn } from '../../utils/format'

export default function PriceTag({ price, originalPrice, size = 'sm', className }) {
  const off = discountPercent(price, originalPrice)
  const big = size === 'lg'
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      <span className={cn('font-bold tabular-nums', big ? 'text-2xl sm:text-3xl' : 'text-sm')}>{formatPrice(price)}</span>
      {off > 0 && (
        <>
          <span className={cn('text-ink/40 tabular-nums line-through', big ? 'text-base' : 'text-xs')}>
            <span className="sr-only">Original price </span>
            {formatPrice(originalPrice)}
          </span>
          <span className={cn('font-semibold text-blue', big ? 'text-sm' : 'text-xs')}>{off}% off</span>
        </>
      )}
    </div>
  )
}
