import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Banknote, Check, ChevronLeft, CreditCard, Landmark, Lock, ShoppingBag, Smartphone } from 'lucide-react'
import Seo from '../components/common/Seo'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import FormField from '../components/common/FormField'
import SmartImage from '../components/common/SmartImage'
import OrderSummary from '../components/cart/OrderSummary'
import { useCart } from '../context/CartContext'
import { INDIAN_STATES, SHIPPING } from '../data/site'
import { cn, formatPrice } from '../utils/format'
import { isValidEmail, isValidPhone, isValidPincode, normalisePhone, required, validate } from '../utils/validation'

const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard delivery', eta: '3–7 business days' },
  { id: 'express', label: 'Express delivery', eta: '2–4 business days', fee: SHIPPING.expressFee },
]

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', text: 'GPay, PhonePe, Paytm or any UPI app', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', text: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', text: 'All major Indian banks', icon: Landmark },
  { id: 'cod', label: 'Cash on Delivery', text: 'Pay when your order arrives', icon: Banknote },
]

const RULES = {
  email: (v) => (!v.trim() ? 'Email is required.' : !isValidEmail(v) ? 'Enter a valid email address.' : undefined),
  phone: (v) =>
    !v.trim() ? 'Phone number is required.' : !isValidPhone(v) ? 'Enter a valid 10-digit Indian mobile number.' : undefined,
  firstName: required('First name'),
  lastName: required('Last name'),
  address: (v) => (!v.trim() ? 'Address is required.' : v.trim().length < 8 ? 'Please enter your full address.' : undefined),
  city: required('City'),
  state: required('State'),
  pincode: (v) => (!v.trim() ? 'PIN code is required.' : !isValidPincode(v) ? 'Enter a valid 6-digit PIN code.' : undefined),
}

const INITIAL = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  pincode: '',
}

function Step({ n, title, children }) {
  return (
    <section className="border-b border-ink/10 py-8 first:pt-0" aria-labelledby={`step-${n}`}>
      <h2 id={`step-${n}`} className="mb-6 flex items-center gap-3 text-sm font-bold tracking-[0.15em] uppercase">
        <span className="flex size-7 items-center justify-center bg-ink text-xs text-white">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function OptionCard({ name, value, checked, onChange, children }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-4 border p-4 transition-colors',
        checked ? 'border-ink bg-mist' : 'border-ink/15 hover:border-ink/40',
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border-2 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue',
          checked ? 'border-ink' : 'border-ink/30',
        )}
        aria-hidden="true"
      >
        {checked && <span className="size-2.5 rounded-full bg-ink" />}
      </span>
      {children}
    </label>
  )
}

export default function Checkout() {
  const cart = useCart()
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [payment, setPayment] = useState('upi')
  const [placing, setPlacing] = useState(false)

  if (cart.items.length === 0 && !placing) {
    return (
      <>
        <Seo title="Checkout" noIndex />
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          text="Your bag is empty. Add a few pieces and come back here to place your order."
          action={{ label: 'Shop now', to: '/shop' }}
        />
      </>
    )
  }

  const shippingFee =
    shippingMethod === 'express' ? SHIPPING.expressFee : cart.qualifiesFreeShipping ? 0 : SHIPPING.standardFee
  const total = cart.subtotal + shippingFee

  const onChange = (e) => {
    const { name, value } = e.target
    const next = { ...values, [name]: value }
    setValues(next)
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: RULES[name]?.(value, next) }))
  }

  const onBlur = (e) => {
    const { name, value } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    if (RULES[name]) setErrors((prev) => ({ ...prev, [name]: RULES[name](value, values) }))
  }

  const field = (id) => ({ id, value: values[id], onChange, onBlur, error: errors[id] })

  const placeOrder = (e) => {
    e.preventDefault()
    const found = validate(values, RULES)
    setErrors(found)
    setTouched(Object.fromEntries(Object.keys(RULES).map((k) => [k, true])))
    if (Object.keys(found).length) {
      const first = Object.keys(RULES).find((k) => found[k])
      formRef.current?.querySelector(`[name="${first}"]`)?.focus()
      return
    }

    setPlacing(true)
    // Frontend simulation only — no payment is taken and no order is sent anywhere.
    setTimeout(() => {
      const order = {
        id: `GR${Date.now().toString().slice(-8)}`,
        placedAt: new Date().toISOString(),
        customer: { ...values, phone: normalisePhone(values.phone) },
        shippingMethod: SHIPPING_METHODS.find((m) => m.id === shippingMethod),
        payment: PAYMENT_METHODS.find((m) => m.id === payment)?.label,
        items: cart.items.map((i) => ({
          id: i.id,
          name: i.product.name,
          size: i.size,
          qty: i.qty,
          price: i.product.price,
          image: i.product.images[0],
          condition: i.product.condition,
        })),
        subtotal: cart.subtotal,
        shipping: shippingFee,
        total,
      }
      try {
        sessionStorage.setItem('gr:last-order', JSON.stringify(order))
      } catch {
        /* ignore */
      }
      cart.clearCart()
      navigate('/order-confirmed', { replace: true, state: { order } })
    }, 1400)
  }

  return (
    <>
      <Seo title="Checkout" noIndex />
      <div className="container-x py-8 sm:py-12">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.15em] text-ink/60 uppercase hover:text-ink"
        >
          <ChevronLeft className="size-4" /> Back to bag
        </Link>
        <h1 className="heading-xl mt-4 mb-10">Checkout</h1>

        <form ref={formRef} onSubmit={placeOrder} noValidate className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Step n={1} title="Contact">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" {...field('email')} />
                <FormField
                  label="Phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="10-digit mobile number"
                  hint="For delivery updates on WhatsApp / SMS"
                  {...field('phone')}
                />
              </div>
            </Step>

            <Step n={2} title="Delivery address">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="First name" autoComplete="given-name" {...field('firstName')} />
                <FormField label="Last name" autoComplete="family-name" {...field('lastName')} />
                <FormField
                  label="Address"
                  autoComplete="address-line1"
                  placeholder="House no., street, area"
                  className="sm:col-span-2"
                  {...field('address')}
                />
                <FormField
                  label="Apartment, landmark"
                  autoComplete="address-line2"
                  optional
                  className="sm:col-span-2"
                  {...field('apartment')}
                />
                <FormField label="City" autoComplete="address-level2" {...field('city')} />
                <FormField label="State" as="select" autoComplete="address-level1" {...field('state')}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </FormField>
                <FormField
                  label="PIN code"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  {...field('pincode')}
                />
                <div className="flex items-end">
                  <p className="pb-3 text-xs text-ink/50">Shipping within India only.</p>
                </div>
              </div>
            </Step>

            <Step n={3} title="Shipping method">
              <div className="grid gap-3">
                {SHIPPING_METHODS.map((m) => {
                  const fee = m.id === 'express' ? m.fee : cart.qualifiesFreeShipping ? 0 : SHIPPING.standardFee
                  return (
                    <OptionCard
                      key={m.id}
                      name="shipping"
                      value={m.id}
                      checked={shippingMethod === m.id}
                      onChange={() => setShippingMethod(m.id)}
                    >
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">{m.label}</span>
                        <span className="block text-xs text-ink/60">{m.eta}</span>
                      </span>
                      <span className="text-sm font-bold tabular-nums">{fee === 0 ? 'Free' : formatPrice(fee)}</span>
                    </OptionCard>
                  )
                })}
              </div>
            </Step>

            <Step n={4} title="Payment">
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((m) => (
                  <OptionCard
                    key={m.id}
                    name="payment"
                    value={m.id}
                    checked={payment === m.id}
                    onChange={() => setPayment(m.id)}
                  >
                    <m.icon className="size-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{m.label}</span>
                      <span className="block text-xs text-ink/60">{m.text}</span>
                    </span>
                  </OptionCard>
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs text-ink/60">
                <Lock className="mt-0.5 size-3.5 shrink-0" />
                {payment === 'cod'
                  ? 'Pay in cash or UPI to the delivery partner when your order arrives.'
                  : 'You’ll complete payment securely with our payment partner after placing your order.'}
              </p>
            </Step>
          </div>

          <aside className="lg:col-span-5" aria-label="Order summary">
            <div className="bg-mist p-5 sm:p-8 lg:sticky lg:top-24">
              <h2 className="mb-6 text-sm font-bold tracking-[0.15em] uppercase">
                Order summary <span className="text-ink/40">({cart.count})</span>
              </h2>
              <ul className="mb-6 max-h-80 space-y-4 overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <li key={item.key} className="flex gap-4">
                    <div className="relative w-16 shrink-0">
                      <SmartImage src={item.product.images[0]} alt={item.product.name} ratio={1.25} width={160} sizes="64px" />
                      <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center bg-ink text-[10px] font-bold text-white">
                        {item.qty}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-semibold uppercase">{item.product.name}</p>
                      <p className="mt-1 text-[11px] text-ink/60">
                        Size {item.size} · {item.product.condition}
                        {item.product.conditionGrade ? ` (${item.product.conditionGrade})` : ''}
                      </p>
                    </div>
                    <p className="text-xs font-bold tabular-nums">{formatPrice(item.lineTotal)}</p>
                  </li>
                ))}
              </ul>
              <div className="border-t border-ink/10 pt-6">
                <OrderSummary
                  subtotal={cart.subtotal}
                  savings={cart.savings}
                  shipping={shippingFee}
                  total={total}
                  shippingLabel={shippingMethod === 'express' ? 'Express shipping' : 'Shipping'}
                />
              </div>
              <Button type="submit" variant="blue" block size="lg" className="mt-6" loading={placing}>
                {placing ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
              </Button>
              <ul className="mt-5 space-y-2 text-[11px] text-ink/60">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-blue" /> Every pre-loved item is graded and described honestly
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-blue" /> Dispatched within 1–2 business days
                </li>
              </ul>
              <p className="mt-5 text-[11px] leading-relaxed text-ink/50">
                By placing your order you agree to our{' '}
                <Link to="/terms" className="underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/returns" className="underline">
                  Return Policy
                </Link>
                .
              </p>
            </div>
          </aside>
        </form>
      </div>
    </>
  )
}
