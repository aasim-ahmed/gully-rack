import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, ShieldCheck, ShoppingBag } from 'lucide-react'
import Seo from '../components/common/Seo'
import EmptyState from '../components/common/EmptyState'
import Button, { ButtonLink } from '../components/common/Button'
import CartItem from '../components/cart/CartItem'
import SplitText from '../components/motion/SplitText'
import OrderSummary, { FreeShippingProgress } from '../components/cart/OrderSummary'
import ProductRail from '../components/home/ProductRail'
import { useCart } from '../context/CartContext'
import { getFeaturedProducts } from '../data/products'
import { SHIPPING } from '../data/site'
import { pluralize } from '../utils/format'

export default function Cart() {
  const cart = useCart()
  const navigate = useNavigate()
  const inCart = new Set(cart.items.map((i) => i.id))
  const suggestions = getFeaturedProducts(12).filter((p) => !inCart.has(p.id) && p.stock > 0)

  if (cart.items.length === 0) {
    return (
      <>
        <Seo title="Your Bag" noIndex />
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          text="Nothing on the hanger yet. Pre-loved one-of-ones go fast — find yours before someone else does."
          action={{ label: 'Start shopping', to: '/shop' }}
          secondary={{ label: 'View wishlist', to: '/wishlist' }}
        />
        <ProductRail label="Popular right now" title="Trending" accent="picks" products={suggestions} />
      </>
    )
  }

  return (
    <>
      <Seo title="Your Bag" noIndex />
      <div className="container-x py-10 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-6">
          <SplitText
            as="h1"
            trigger="mount"
            className="text-[16vw] leading-[0.82] font-extrabold tracking-tightest uppercase sm:text-8xl lg:text-9xl"
            lines={[{ text: `Your bag (${cart.count})`, lastClassName: 'accent text-blue text-[0.6em]' }]}
          />
          <Link to="/shop" className="group inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase">
            <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-1" />
            <span className="link-underline">Continue shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <section className="lg:col-span-7 xl:col-span-8" aria-label="Bag items">
            <ul className="divide-y divide-ink/10">
              {cart.items.map((item) => (
                <CartItem key={item.key} item={item} />
              ))}
            </ul>
          </section>

          <aside className="lg:col-span-5 xl:col-span-4" aria-label="Order summary">
            <div className="lg:sticky lg:top-24 lg:pt-6">
              <div className="bg-mist p-5 sm:p-7">
                <h2 className="mb-5 text-2xl font-extrabold tracking-tighter uppercase">Summary</h2>
                <FreeShippingProgress
                  subtotal={cart.subtotal}
                  threshold={SHIPPING.freeThreshold}
                  remaining={cart.remainingForFreeShipping}
                />
                <div className="mt-6">
                  <OrderSummary
                    subtotal={cart.subtotal}
                    savings={cart.savings}
                    shipping={cart.shipping}
                    total={cart.total}
                  />
                </div>
                <Button block size="lg" className="mt-6" onClick={() => navigate('/checkout')}>
                  <Lock className="size-4" /> Proceed to checkout
                </Button>
                <ButtonLink to="/shop" variant="outline" block className="mt-3">
                  Continue shopping
                </ButtonLink>
                <p className="mt-5 flex items-center justify-center gap-2 text-[11px] text-ink/50">
                  <ShieldCheck className="size-4" /> {pluralize(cart.count, 'item')} · Secure checkout
                </p>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-ink/50">
                Items in your bag are not reserved. One-of-one pieces can sell out before checkout.
              </p>
            </div>
          </aside>
        </div>
      </div>
      {suggestions.length > 0 && (
        <ProductRail label="Complete the fit" title="You may" accent="also like" products={suggestions} />
      )}
    </>
  )
}
