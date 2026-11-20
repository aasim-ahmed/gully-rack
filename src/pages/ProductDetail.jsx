import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowRight, BadgeCheck, PackageX, RotateCcw, Ruler, Truck } from 'lucide-react'
import Seo from '../components/common/Seo'
import Breadcrumbs from '../components/common/Breadcrumbs'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import QuantitySelector from '../components/common/QuantitySelector'
import Accordion, { AccordionItem } from '../components/common/Accordion'
import ProductGallery from '../components/products/ProductGallery'
import SizeSelector from '../components/products/SizeSelector'
import WishlistButton from '../components/products/WishlistButton'
import Reveal from '../components/motion/Reveal'
import ProductRail from '../components/home/ProductRail'
import { getProductBySlug, getRelatedProducts } from '../data/products'
import { getCategory } from '../data/categories'
import { SHIPPING } from '../data/site'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { buildImageUrl } from '../utils/images'
import { cn, discountPercent, formatPrice } from '../utils/format'
import { productNumber } from '../utils/productLabels'

const GRADES = ['Good', 'Very Good', 'Excellent']
const GRADE_TEXT = {
  Excellent: 'Minimal or no signs of wear.',
  'Very Good': 'Light, honest wear — described below.',
  Good: 'Visible wear, reflected in the price.',
}

export default function ProductDetail() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const { addItem, items } = useCart()
  const { openCart } = useUI()

  // The page remounts per product (Layout keys <main> by pathname), so initial state is enough.
  const [size, setSize] = useState(() => (product?.sizes.length === 1 ? product.sizes[0] : ''))
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState('')

  if (!product) {
    return (
      <>
        <Seo title="Product not found" noIndex />
        <EmptyState
          icon={PackageX}
          title="This piece has left the rack"
          text="The product you’re looking for doesn’t exist or may have been removed. Plenty more where that came from."
          action={{ label: 'Shop all', to: '/shop' }}
          secondary={{ label: 'New arrivals', to: '/shop?collection=new' }}
        />
      </>
    )
  }

  const category = getCategory(product.category)
  const soldOut = product.stock <= 0
  const preLoved = product.condition === 'Pre-Loved'
  const off = discountPercent(product.price, product.originalPrice)
  const inCart = items.filter((i) => i.id === product.id).reduce((n, i) => n + i.qty, 0)
  const maxQty = Math.max(1, product.stock - inCart)
  const allInCart = !soldOut && inCart >= product.stock
  const related = getRelatedProducts(product, 8)
  const hygieneItem = product.category === 'accessories' && product.name.match(/sunglass|cap|beanie/i)
  const returnNote = hygieneItem
    ? 'Returnable only if faulty'
    : preLoved
      ? 'Returns if not as described'
      : '7-day easy returns'

  const handleAdd = () => {
    if (!size) {
      setSizeError('Please select a size.')
      return
    }
    if (addItem(product, size, qty)) {
      setQty(1)
      openCart()
    }
  }

  return (
    <>
      <Seo
        title={product.name}
        description={`${product.name} — ${product.condition}${preLoved ? ` (${product.conditionGrade})` : ''}, ${formatPrice(product.price)}. ${product.description}`}
        image={buildImageUrl(product.images[0], 1200)}
        type="product"
      />

      <div className="lg:container-x pb-16 lg:pt-8 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          <div className="lg:col-span-7">
            <ProductGallery key={product.id} images={product.images} name={product.name} />
          </div>

          <div className="container-x pt-8 lg:col-span-5 lg:px-0 lg:pt-0">
            <div className="lg:sticky lg:top-24">
              <Breadcrumbs
                items={[
                  { label: 'Shop', to: '/shop' },
                  { label: category?.name, to: `/shop?category=${product.category}` },
                  { label: product.name },
                ]}
              />

              <Reveal y={20} className="mt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="label bg-ink px-1.5 py-1 text-white">{productNumber(product)}</span>
                  <span className={cn('label px-1.5 py-1 font-bold', preLoved ? 'bg-mist text-ink' : 'border border-blue text-blue')}>
                    {preLoved ? `Pre-Loved · ${product.conditionGrade}` : 'New'}
                  </span>
                  {soldOut ? (
                    <span className="label border border-ink/20 px-1.5 py-1">Sold out</span>
                  ) : preLoved && product.stock === 1 ? (
                    <span className="label bg-blue px-1.5 py-1 font-bold text-white">1 of 1</span>
                  ) : product.stock <= 5 ? (
                    <span className="label bg-blue px-1.5 py-1 font-bold text-white">Only {product.stock} left</span>
                  ) : (
                    <span className="label text-ink/50">In stock</span>
                  )}
                </div>

                <p className="label mt-6 text-ink/50">
                  {category?.name} · {product.gender}
                </p>
                <h1 className="mt-2 text-4xl leading-[0.9] font-extrabold tracking-tighter uppercase sm:text-5xl xl:text-6xl">
                  {product.name}
                </h1>
                <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-3xl font-bold tabular-nums">{formatPrice(product.price)}</span>
                  {off > 0 && (
                    <>
                      <span className="text-base text-ink/40 tabular-nums line-through">
                        <span className="sr-only">Original price </span>
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="label bg-blue px-1.5 py-1 font-bold text-white">−{off}%</span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs text-ink/50">
                  {preLoved && off > 0 ? 'Compared with original retail price. ' : ''}Inclusive of all taxes.
                </p>

                <p className="mt-6 text-[15px] leading-relaxed text-ink/70">{product.description}</p>
              </Reveal>

              {/* Condition — always explicit, never hidden in an accordion. */}
              <Reveal y={20} delay={0.05} className={cn('mt-8 p-5 sm:p-6', preLoved ? 'bg-ink text-white' : 'border border-ink/15')}>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-extrabold tracking-[0.12em] uppercase">
                    {preLoved ? `Pre-Loved — ${product.conditionGrade}` : 'Brand new'}
                  </p>
                  {!preLoved && <BadgeCheck className="size-5 shrink-0 text-blue" aria-hidden="true" />}
                </div>
                {preLoved && (
                  <>
                    <div className="mt-4 grid grid-cols-3 gap-1" aria-hidden="true">
                      {GRADES.map((g, i) => (
                        <div key={g}>
                          <div
                            className={cn(
                              'h-1',
                              i <= GRADES.indexOf(product.conditionGrade) ? 'bg-blue' : 'bg-white/20',
                            )}
                          />
                          <p className={cn('label mt-2', g === product.conditionGrade ? 'text-white' : 'text-white/40')}>
                            {g}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-xs text-white/60">
                      Previously owned and worn. {GRADE_TEXT[product.conditionGrade]}
                    </p>
                  </>
                )}
                <p className={cn('mt-3 text-sm leading-relaxed', preLoved ? 'text-white/90' : 'text-ink/75')}>
                  {product.conditionDescription}
                </p>
              </Reveal>

              <div className="mt-8">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase">
                    Size{size && <span className="font-medium text-ink/50"> — {size}</span>}
                  </p>
                  {product.fit && (
                    <p className="flex items-center gap-1.5 text-[11px] text-ink/60">
                      <Ruler className="size-3.5" aria-hidden="true" /> {product.fit}
                    </p>
                  )}
                </div>
                <SizeSelector
                  sizes={product.sizes}
                  value={size}
                  onChange={(s) => {
                    setSize(s)
                    setSizeError('')
                  }}
                  disabled={soldOut}
                  error={sizeError}
                />
                {preLoved && product.sizes.length === 1 && !soldOut && (
                  <p className="mt-2 text-[11px] text-ink/50">Single piece, available in this size only.</p>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                {!preLoved && !soldOut && (
                  <QuantitySelector value={Math.min(qty, maxQty)} onChange={setQty} max={maxQty} size="lg" />
                )}
                <Button size="lg" block onClick={handleAdd} disabled={soldOut || allInCart} className="flex-1">
                  {soldOut ? 'Sold out' : allInCart ? 'Already in your bag' : (
                    <>
                      Add to bag <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
                <WishlistButton product={product} variant="outline" size="lg" className="sm:size-16!" />
              </div>
              {soldOut && (
                <p className="mt-3 text-xs text-ink/60">
                  This piece has found a new home. Save it to your wishlist — similar finds land every Friday.
                </p>
              )}

              <ul className="mt-8 grid gap-3 border-y border-ink/10 py-5 text-xs text-ink/70 sm:grid-cols-2">
                <li className="flex items-center gap-2.5">
                  <Truck className="size-4 shrink-0 text-ink" aria-hidden="true" />
                  Free shipping over {formatPrice(SHIPPING.freeThreshold)}
                </li>
                <li className="flex items-center gap-2.5">
                  <RotateCcw className="size-4 shrink-0 text-ink" aria-hidden="true" />
                  {returnNote}
                </li>
              </ul>

              <Accordion className="mt-2 border-t-0">
                <AccordionItem title="Product details" defaultOpen>
                  <ul className="list-disc space-y-1.5 pl-5">
                    {product.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-ink/50">Product ID: {product.id.toUpperCase()}</p>
                </AccordionItem>
                {product.measurements && (
                  <AccordionItem title="Measurements">
                    <p className="mb-3">Measured flat, by hand. Allow ±1 cm.</p>
                    <dl className="divide-y divide-ink/10 border-y border-ink/10">
                      {Object.entries(product.measurements).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-2.5">
                          <dt className="text-ink/60">{k}</dt>
                          <dd className="font-semibold text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </AccordionItem>
                )}
                <AccordionItem title="Care instructions">
                  <ul className="list-disc space-y-1.5 pl-5">
                    {product.care.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </AccordionItem>
                <AccordionItem title="Shipping & returns">
                  <p>
                    Dispatched within 1–2 business days. Standard delivery in 3–7 business days, free on orders over{' '}
                    {formatPrice(SHIPPING.freeThreshold)}.
                  </p>
                  <p className="mt-3">
                    {hygieneItem
                      ? 'For hygiene reasons this item can only be returned if it arrives faulty.'
                      : preLoved
                        ? 'Pre-loved items can be returned within 48 hours of delivery if they are significantly not as described.'
                        : 'New items can be returned unworn with tags within 7 days of delivery.'}
                  </p>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <ProductRail label="You might also like" title="More from" accent="the rack." products={related} tone="mist" />
      )}
    </>
  )
}
