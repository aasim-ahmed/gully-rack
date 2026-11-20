import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Lock, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import SmartImage from '../common/SmartImage'
import { buttonClasses } from '../common/buttonStyles'
import { FreeShippingProgress } from './OrderSummary'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { useEscapeKey, useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { SHIPPING } from '../../data/site'
import { EASE_IN_OUT, EASE_OUT } from '../motion/easing'
import { formatPrice, pluralize } from '../../utils/format'

function DrawerLine({ item, index }) {
  const { updateQty, removeItem } = useCart()
  const { product, size, qty, key, lineTotal } = item
  const preLoved = product.condition === 'Pre-Loved'
  const href = `/product/${product.slug}`

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0, transition: { delay: 0.15 + index * 0.05, duration: 0.5, ease: EASE_OUT } }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
      className="flex gap-4 border-b border-ink/10 py-5"
    >
      <Link to={href} className="w-20 shrink-0 sm:w-24">
        <SmartImage src={product.images[0]} alt={product.name} ratio={1.25} width={240} sizes="96px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="label text-ink/50">
              {preLoved ? `Pre-Loved · ${product.conditionGrade}` : 'New'} · Size {size}
            </p>
            <h3 className="mt-1 line-clamp-2 text-[13px] leading-snug font-semibold uppercase">
              <Link to={href} className="hover:text-blue">
                {product.name}
              </Link>
            </h3>
          </div>
          <button
            type="button"
            onClick={() => removeItem(key)}
            className="-mt-1 -mr-1 p-1.5 text-ink/40 transition-colors hover:text-ink"
            aria-label={`Remove ${product.name} from bag`}
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {product.stock > 1 ? (
            <div className="flex h-8 items-center border border-ink/15">
              <button
                type="button"
                className="flex size-8 items-center justify-center disabled:opacity-30"
                onClick={() => updateQty(key, qty - 1)}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="size-3" />
              </button>
              <span className="w-6 text-center text-xs font-semibold tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                className="flex size-8 items-center justify-center disabled:opacity-30"
                onClick={() => updateQty(key, qty + 1)}
                disabled={qty >= product.stock}
                aria-label="Increase quantity"
              >
                <Plus className="size-3" />
              </button>
            </div>
          ) : (
            <span className="label text-ink/40">One-of-one</span>
          )}
          <p className="text-sm font-bold tabular-nums">{formatPrice(lineTotal)}</p>
        </div>
      </div>
    </motion.li>
  )
}

/** Slide-out bag. Opens from the navbar, the mobile dock and every "Add to bag". */
export default function CartDrawer() {
  const cart = useCart()
  const { cartOpen, closeCart } = useUI()
  const navigate = useNavigate()
  useLockBodyScroll(cartOpen)
  useEscapeKey(cartOpen, closeCart)

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Your bag">
          <motion.button
            type="button"
            aria-label="Close bag"
            className="absolute inset-0 bg-ink/60"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-white"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE_IN_OUT }}
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-5 py-5 sm:px-7">
              <h2 className="text-2xl font-extrabold tracking-tighter uppercase">
                Bag <span className="accent text-blue">({cart.count})</span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                autoFocus
                className="flex h-10 items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase"
              >
                Close <X className="size-4" />
              </button>
            </header>

            {cart.items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <ShoppingBag className="size-10 text-ink/20" strokeWidth={1.25} aria-hidden="true" />
                <p className="mt-6 text-3xl font-extrabold tracking-tighter uppercase">
                  Empty <span className="accent text-blue">rack</span>
                </p>
                <p className="mt-3 max-w-xs text-sm text-ink/60">
                  Nothing in your bag yet. One-of-one pieces go fast, so don’t think too long.
                </p>
                <Link to="/shop" className={buttonClasses({ className: 'mt-8' })}>
                  Start shopping <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="px-5 pt-5 sm:px-7">
                  <FreeShippingProgress
                    subtotal={cart.subtotal}
                    threshold={SHIPPING.freeThreshold}
                    remaining={cart.remainingForFreeShipping}
                  />
                </div>
                <ul className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7">
                  <AnimatePresence initial={false}>
                    {cart.items.map((item, i) => (
                      <DrawerLine key={item.key} item={item} index={i} />
                    ))}
                  </AnimatePresence>
                </ul>
                <footer className="border-t border-ink/10 bg-mist px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-7">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink/60">Subtotal · {pluralize(cart.count, 'item')}</dt>
                      <dd className="font-semibold tabular-nums">{formatPrice(cart.subtotal)}</dd>
                    </div>
                    {cart.savings > 0 && (
                      <div className="flex justify-between text-blue">
                        <dt>You save</dt>
                        <dd className="font-semibold tabular-nums">−{formatPrice(cart.savings)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-ink/60">Shipping</dt>
                      <dd className="font-semibold tabular-nums">
                        {cart.shipping === 0 ? 'Free' : formatPrice(cart.shipping)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
                      <dt className="text-xs font-bold tracking-[0.15em] uppercase">Total</dt>
                      <dd className="text-2xl font-extrabold tabular-nums">{formatPrice(cart.total)}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className={buttonClasses({ variant: 'blueDark', size: 'lg', block: true, className: 'mt-5' })}
                  >
                    <Lock className="size-4" /> Checkout
                  </button>
                  <Link
                    to="/cart"
                    className="mt-3 flex h-10 items-center justify-center text-[11px] font-semibold tracking-[0.2em] uppercase"
                  >
                    <span className="link-underline">View full bag</span>
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
