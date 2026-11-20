import { useLocation } from 'react-router-dom'
import { CircleCheck, PackageSearch } from 'lucide-react'
import Seo from '../components/common/Seo'
import EmptyState from '../components/common/EmptyState'
import { ButtonLink } from '../components/common/Button'
import SmartImage from '../components/common/SmartImage'
import { formatPrice } from '../utils/format'

function readOrder(state) {
  if (state?.order) return state.order
  try {
    return JSON.parse(sessionStorage.getItem('gr:last-order'))
  } catch {
    return null
  }
}

export default function OrderConfirmation() {
  const { state } = useLocation()
  const order = readOrder(state)

  if (!order) {
    return (
      <>
        <Seo title="Order" noIndex />
        <EmptyState
          icon={PackageSearch}
          title="No recent order"
          text="We couldn’t find a recent order in this browser session."
          action={{ label: 'Continue shopping', to: '/shop' }}
        />
      </>
    )
  }

  const { customer } = order
  const date = new Date(order.placedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <>
      <Seo title="Order confirmed" noIndex />
      <div className="container-x max-w-4xl py-12 sm:py-20">
        <div className="text-center">
          <CircleCheck className="mx-auto size-14 text-blue" strokeWidth={1.5} aria-hidden="true" />
          <p className="eyebrow mt-6 text-ink/50">Order #{order.id}</p>
          <h1 className="heading-xl mt-3">
            It’s yours, <span className="accent text-blue">{customer.firstName}.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-ink/60">
            Thanks for shopping the rack. A confirmation will be sent to{' '}
            <strong className="text-ink">{customer.email}</strong>, and we’ll share tracking on{' '}
            <strong className="text-ink">+91 {customer.phone}</strong> once your order ships.
          </p>
        </div>

        <div className="mt-12 grid gap-px bg-ink/10 sm:grid-cols-3">
          <div className="bg-white p-5">
            <p className="eyebrow text-ink/40">Placed</p>
            <p className="mt-2 text-sm font-semibold">{date}</p>
          </div>
          <div className="bg-white p-5">
            <p className="eyebrow text-ink/40">Delivery</p>
            <p className="mt-2 text-sm font-semibold">{order.shippingMethod?.label}</p>
            <p className="text-xs text-ink/60">{order.shippingMethod?.eta}</p>
          </div>
          <div className="bg-white p-5">
            <p className="eyebrow text-ink/40">Payment</p>
            <p className="mt-2 text-sm font-semibold">{order.payment}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <section aria-labelledby="ship-to">
            <h2 id="ship-to" className="mb-4 text-xs font-bold tracking-[0.15em] uppercase">
              Shipping to
            </h2>
            <address className="text-sm leading-relaxed text-ink/70 not-italic">
              {customer.firstName} {customer.lastName}
              <br />
              {customer.address}
              {customer.apartment && (
                <>
                  <br />
                  {customer.apartment}
                </>
              )}
              <br />
              {customer.city}, {customer.state} {customer.pincode}
            </address>
          </section>

          <section aria-labelledby="items-title">
            <h2 id="items-title" className="mb-4 text-xs font-bold tracking-[0.15em] uppercase">
              Items
            </h2>
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="w-14 shrink-0">
                    <SmartImage src={item.image} alt={item.name} ratio={1.25} width={140} sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase">{item.name}</p>
                    <p className="text-[11px] text-ink/60">
                      Size {item.size} · Qty {item.qty} · {item.condition}
                    </p>
                  </div>
                  <p className="text-xs font-bold tabular-nums">{formatPrice(item.price * item.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60">Shipping</dt>
                <dd className="tabular-nums">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex justify-between pt-2 font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/shop" size="lg">
            Continue shopping
          </ButtonLink>
          <ButtonLink to="/contact" variant="outline" size="lg">
            Need help?
          </ButtonLink>
        </div>
      </div>
    </>
  )
}
