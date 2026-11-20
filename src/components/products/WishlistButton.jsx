import { motion, useAnimationControls } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import { cn } from '../../utils/format'

/** Heart that pops and throws a ring when saved. */
export default function WishlistButton({ product, className, variant = 'float', size = 'md' }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const saved = isWishlisted(product.id)
  const heart = useAnimationControls()
  const ring = useAnimationControls()

  const onClick = () => {
    if (!saved) {
      heart.start({ scale: [1, 1.4, 0.9, 1], transition: { duration: 0.5 } })
      ring.start({ scale: [0.4, 1.8], opacity: [0.8, 0], transition: { duration: 0.55 } })
    } else {
      heart.start({ scale: [1, 0.8, 1], transition: { duration: 0.3 } })
    }
    toggleWishlist(product)
  }

  const box = size === 'lg' ? 'size-14' : 'size-10'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn(
        'flex shrink-0 items-center justify-center transition-colors',
        !className?.includes('absolute') && 'relative',
        box,
        variant === 'float' && 'text-ink',
        variant === 'outline' && (saved ? 'border border-blue bg-blue text-white' : 'border border-ink/20 hover:border-ink'),
        className,
      )}
    >
      {variant === 'float' && (
        <span className="absolute inset-1.5 bg-white/90 transition-transform duration-300 hover:scale-110" aria-hidden="true" />
      )}
      <motion.span
        className="pointer-events-none absolute inset-0 m-auto size-6 rounded-full border border-blue"
        initial={{ opacity: 0 }}
        animate={ring}
        aria-hidden="true"
      />
      <motion.span animate={heart} className="relative flex">
        <Heart
          className={cn(
            size === 'lg' ? 'size-5' : 'size-4',
            saved && (variant === 'outline' ? 'fill-white text-white' : 'fill-blue text-blue'),
          )}
          strokeWidth={2}
        />
      </motion.span>
    </button>
  )
}
