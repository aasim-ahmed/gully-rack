import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import SmartImage from '../common/SmartImage'
import WishlistButton from './WishlistButton'
import { useCart } from '../../context/CartContext'
import { cn, discountPercent, formatPrice } from '../../utils/format'
import { conditionLabel, productNumber, sizeSummary } from '../../utils/productLabels'

/**
 * Campaign-style product card.
 * Desktop: hover swaps to the second shot with a wipe, and the size bar slides up for one-tap adding.
 * Touch: the "+" button opens the same size bar.
 * tone="dark" for black sections. ratio is height/width of the image.
 */
function ProductCard({ product, priority = false, sizes, tone = 'light', ratio = 1.25, className, showNumber = true }) {
  const { addItem } = useCart()
  const [open, setOpen] = useState(false)
  const soldOut = product.stock <= 0
  const preLoved = product.condition === 'Pre-Loved'
  const oneOfOne = !soldOut && preLoved && product.stock === 1
  const lowStock = !soldOut && !preLoved && product.stock <= 3
  const off = discountPercent(product.price, product.originalPrice)
  const href = `/product/${product.slug}`
  const dark = tone === 'dark'

  const add = (size) => {
    if (addItem(product, size, 1)) setOpen(false)
  }

  return (
    <article className={cn('group/card relative flex flex-col', className)} onMouseLeave={() => setOpen(false)}>
      <div className={cn('relative overflow-hidden', dark ? 'bg-graphite' : 'bg-mist')}>
        <Link to={href} aria-label={product.name} className="block" data-cursor="View" draggable={false}>
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            ratio={ratio}
            priority={priority}
            sizes={sizes}
            className={dark ? 'bg-graphite!' : undefined}
            imgClassName={cn(
              'transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.06]',
              soldOut && 'grayscale opacity-60',
            )}
            draggable={false}
          />
          {product.images[1] && !soldOut && (
            <SmartImage
              src={product.images[1]}
              alt=""
              ratio={ratio}
              sizes={sizes}
              className="pointer-events-none absolute! inset-0 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/card:[clip-path:inset(0_0_0_0)] pointer-coarse:hidden"
              imgClassName="scale-105 transition-transform duration-[1.2s] group-hover/card:scale-100"
              draggable={false}
            />
          )}
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1">
          {showNumber && <span className="label bg-ink px-1.5 py-1 text-white">{productNumber(product)}</span>}
          {soldOut && <span className="label bg-white px-1.5 py-1 font-bold text-ink">Sold out</span>}
          {oneOfOne && <span className="label bg-blue px-1.5 py-1 font-bold text-white">1 of 1</span>}
          {lowStock && <span className="label bg-blue px-1.5 py-1 font-bold text-white">Only {product.stock} left</span>}
        </div>

        <WishlistButton product={product} className="absolute top-1.5 right-1.5" />

        {!soldOut && (
          <>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Close size picker' : `Quick add ${product.name}`}
              className="absolute right-2 bottom-2 z-10 flex size-9 items-center justify-center bg-white text-ink pointer-fine:hidden"
            >
              {open ? <X className="size-4" /> : <Plus className="size-4" />}
            </button>
            <div
              className={cn(
                'absolute inset-x-0 bottom-0 bg-white p-2.5 text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-3',
                open ? 'translate-y-0' : 'translate-y-full',
                'pointer-fine:group-hover/card:translate-y-0 pointer-fine:group-focus-within/card:translate-y-0',
              )}
              role="group"
              aria-label={`Quick add ${product.name}`}
            >
              <p className="label mb-2 flex justify-between text-ink/50">
                <span>Quick add</span>
                <span className="pointer-coarse:hidden">{preLoved ? 'Single piece' : 'Pick a size'}</span>
              </p>
              <div className="flex flex-wrap gap-1 pr-10 pointer-fine:pr-0">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => add(s)}
                    className="h-8 min-w-9 flex-1 border border-ink/15 px-2 text-[11px] font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-white"
                    aria-label={`Add ${product.name}, size ${s}, to bag`}
                  >
                    {s === 'One Size' ? 'One size' : s}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className={cn('flex flex-1 flex-col pt-3 sm:pt-4', dark ? 'text-white' : 'text-ink')}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-[12px] leading-snug font-semibold uppercase sm:text-[13px]">
            <Link to={href} className="transition-colors hover:text-blue">
              {product.name}
            </Link>
          </h3>
          <p className="shrink-0 text-right text-[12px] font-bold tabular-nums sm:text-[13px]">
            {formatPrice(product.price)}
            {off > 0 && (
              <span className={cn('block text-[10px] font-medium line-through', dark ? 'text-white/40' : 'text-ink/40')}>
                <span className="sr-only">Original price </span>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </p>
        </div>
        <p className={cn('label mt-1.5 flex flex-wrap gap-x-2', dark ? 'text-white/50' : 'text-ink/50')}>
          <span className={preLoved ? (dark ? 'text-white' : 'text-ink') : 'text-blue'}>{conditionLabel(product)}</span>
          <span aria-hidden="true">/</span>
          <span>{sizeSummary(product.sizes)}</span>
        </p>
      </div>
    </article>
  )
}

export default memo(ProductCard)
