import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, X } from 'lucide-react'
import Seo from '../components/common/Seo'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import SmartImage from '../components/common/SmartImage'
import ConditionBadge from '../components/products/ConditionBadge'
import PriceTag from '../components/products/PriceTag'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { cn, pluralize } from '../utils/format'

function WishlistCard({ product }) {
  const { removeFromWishlist } = useWishlist()
  const { addItem } = useCart()
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : '')
  const [error, setError] = useState(false)
  const soldOut = product.stock <= 0
  const href = `/product/${product.slug}`

  const add = () => {
    if (!size) {
      setError(true)
      return
    }
    if (addItem(product, size, 1)) removeFromWishlist(product.id, { silent: true })
  }

  return (
    <li className="flex flex-col">
      <div className="relative">
        <Link to={href}>
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            ratio={1.25}
            imgClassName={cn(soldOut && 'opacity-60 grayscale-[60%]')}
          />
        </Link>
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          <ConditionBadge product={product} />
          {soldOut && (
            <span className="bg-white px-2 py-1 text-[10px] font-bold tracking-[0.15em] uppercase">Sold Out</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => removeFromWishlist(product.id)}
          className="absolute top-2 right-2 flex size-8 items-center justify-center bg-white transition-colors hover:bg-ink hover:text-white"
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <h3 className="text-xs leading-snug font-semibold uppercase sm:text-sm">
          <Link to={href} className="hover:text-blue">
            {product.name}
          </Link>
        </h3>
        <PriceTag price={product.price} originalPrice={product.originalPrice} className="mt-1" />

        {!soldOut && product.sizes.length > 1 && (
          <div className="mt-3">
            <label htmlFor={`size-${product.id}`} className="sr-only">
              Size for {product.name}
            </label>
            <select
              id={`size-${product.id}`}
              value={size}
              onChange={(e) => {
                setSize(e.target.value)
                setError(false)
              }}
              className={cn('field h-10 text-xs', error && 'field-error')}
              aria-invalid={error}
            >
              <option value="">Select size</option>
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {error && (
              <p className="mt-1 text-[11px] text-danger" role="alert">
                Choose a size first.
              </p>
            )}
          </div>
        )}
        {product.sizes.length === 1 && <p className="mt-1 text-[11px] text-ink/50">Size {product.sizes[0]}</p>}

        <div className="mt-auto pt-3">
          <Button size="sm" block onClick={add} disabled={soldOut}>
            {soldOut ? 'Sold Out' : (
              <>
                <ShoppingBag className="size-3.5" /> Add to bag
              </>
            )}
          </Button>
        </div>
      </div>
    </li>
  )
}

export default function Wishlist() {
  const { items } = useWishlist()

  return (
    <>
      <Seo title="Wishlist" noIndex />
      <PageHeader
        crumbs={[{ label: 'Wishlist' }]}
        title="Wishlist"
        text={items.length ? `${pluralize(items.length, 'piece')} saved. Saved items are not reserved — one-of-ones can sell out.` : undefined}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          text="Tap the heart on any piece to keep it here for later. Your wishlist is saved on this device."
          action={{ label: 'Explore the rack', to: '/shop' }}
          secondary={{ label: 'New arrivals', to: '/shop?collection=new' }}
        />
      ) : (
        <div className="container-x py-10 sm:py-14">
          <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <WishlistCard key={p.id} product={p} />
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
