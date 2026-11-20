import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { cn } from '../../utils/format'

const COLS = {
  large: 'grid-cols-1 sm:grid-cols-2',
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
}

const SIZES = {
  large: '(min-width: 1024px) 38vw, (min-width: 640px) 50vw, 100vw',
  2: '(min-width: 1024px) 38vw, 50vw',
  3: '(min-width: 1024px) 26vw, (min-width: 768px) 33vw, 50vw',
  4: '(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw',
}

/**
 * Product grid. `interlude` (optional) is an editorial tile spanning two columns,
 * placed after the fourth product so it always lands on a full row.
 * columns: 2 | 3 | 4 | 'large' (one big image per row on phones, two on desktop).
 */
export default function ProductGrid({ products, columns = 4, interlude, className }) {
  const items = products.flatMap((product, i) => [
    ...(interlude && i === 4 ? [{ key: 'interlude' }] : []),
    { key: product.id, product, i },
  ])
  return (
    <ul className={cn('grid gap-x-3 gap-y-12 sm:gap-x-5 sm:gap-y-16', COLS[columns], className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) =>
          item.product ? (
            <motion.li
              key={item.key}
              layout="position"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, delay: Math.min(item.i, 8) * 0.03, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={item.product} priority={item.i < 4} sizes={SIZES[columns]} />
            </motion.li>
          ) : (
            <motion.li
              key={item.key}
              layout="position"
              className={columns === 'large' ? 'col-span-full' : 'col-span-2'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {interlude}
            </motion.li>
          ),
        )}
      </AnimatePresence>
    </ul>
  )
}

export function ProductGridSkeleton({ count = 8, columns = 4 }) {
  return (
    <ul className={cn('grid gap-x-3 gap-y-12 sm:gap-x-5 sm:gap-y-16', COLS[columns])} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className="skeleton aspect-[4/5]" />
          <div className="skeleton mt-4 h-3 w-3/4" />
          <div className="skeleton mt-2 h-3 w-1/3" />
        </li>
      ))}
    </ul>
  )
}
