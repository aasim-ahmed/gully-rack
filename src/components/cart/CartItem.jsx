import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import SmartImage from '../common/SmartImage'
import QuantitySelector from '../common/QuantitySelector'
import ConditionBadge from '../products/ConditionBadge'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatPrice } from '../../utils/format'

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { product, size, qty, key, lineTotal } = item
  const href = `/product/${product.slug}`
  const saved = isWishlisted(product.id)

  const moveToWishlist = () => {
    if (!saved) toggleWishlist(product)
    removeItem(key, { silent: true })
  }

  return (
    <li className="flex gap-4 py-6 sm:gap-6">
      <Link to={href} className="w-24 shrink-0 sm:w-32">
        <SmartImage src={product.images[0]} alt={product.name} ratio={1.25} width={300} sizes="128px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <ConditionBadge product={product} showGrade />
            <h3 className="mt-2 text-sm leading-snug font-semibold uppercase">
              <Link to={href} className="hover:text-blue">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-xs text-ink/60">
              Size: <span className="font-semibold text-ink">{size}</span>
              <span className="mx-2 text-ink/20">|</span>
              {formatPrice(product.price)} each
            </p>
          </div>
          <p className="shrink-0 text-sm font-bold tabular-nums">{formatPrice(lineTotal)}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          {product.stock > 1 ? (
            <QuantitySelector value={qty} onChange={(v) => updateQty(key, v)} max={product.stock} size="sm" />
          ) : (
            <p className="text-[11px] text-ink/50">One-of-one · Qty 1</p>
          )}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={moveToWishlist}
              className="flex h-9 items-center gap-1.5 px-2 text-[11px] font-semibold tracking-[0.1em] text-ink/60 uppercase transition-colors hover:text-ink"
            >
              <Heart className="size-3.5" /> <span className="hidden sm:inline">Save for later</span>
              <span className="sr-only sm:hidden">Move to wishlist</span>
            </button>
            <button
              type="button"
              onClick={() => removeItem(key)}
              className="flex h-9 items-center gap-1.5 px-2 text-[11px] font-semibold tracking-[0.1em] text-ink/60 uppercase transition-colors hover:text-danger"
              aria-label={`Remove ${product.name} from bag`}
            >
              <Trash2 className="size-3.5" /> <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
