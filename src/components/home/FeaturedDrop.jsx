import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import SmartImage from '../common/SmartImage'
import ImageReveal from '../motion/ImageReveal'
import SplitText from '../motion/SplitText'
import Reveal from '../motion/Reveal'
import ProductCard from '../products/ProductCard'
import WishlistButton from '../products/WishlistButton'
import { buttonClasses } from '../common/buttonStyles'
import { getFeaturedProducts } from '../../data/products'
import { useCart } from '../../context/CartContext'
import { conditionLabel, productNumber } from '../../utils/productLabels'
import { cn, discountPercent, formatPrice } from '../../utils/format'

const FEATURED = getFeaturedProducts(10)
const LEAD = FEATURED.find((p) => p.category === 'jackets' && p.stock > 0) || FEATURED[0]
const SUPPORT = FEATURED.filter((p) => p.id !== LEAD.id && p.stock > 0).slice(0, 2)

/** The lead piece, laid out like a campaign page: big image, oversized name, inline sizes. */
function LeadProduct({ product }) {
  const { addItem } = useCart()
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : '')
  const [error, setError] = useState(false)
  const off = discountPercent(product.price, product.originalPrice)
  const href = `/product/${product.slug}`

  const add = () => {
    if (!size) {
      setError(true)
      return
    }
    addItem(product, size, 1)
  }

  return (
    <article className="grid grid-cols-1 gap-6 lg:grid-cols-7 lg:gap-8">
      <Link to={href} className="group relative block lg:col-span-4" data-cursor="View">
        <ImageReveal className="aspect-[4/5] bg-mist" parallax={24}>
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            width={1200}
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="h-full"
            imgClassName="transition-transform duration-[1.4s] group-hover:scale-[1.05]"
          />
        </ImageReveal>
        <span className="label absolute top-3 left-3 bg-ink px-1.5 py-1 text-white">{productNumber(product)}</span>
        {product.stock === 1 && (
          <span className="label absolute top-3 right-3 bg-blue px-1.5 py-1 font-bold text-white">1 of 1</span>
        )}
      </Link>

      <div className="flex flex-col lg:col-span-3 lg:pt-10">
        <Reveal>
          <p className="label text-blue">Lead piece</p>
          <h3 className="mt-4 text-4xl leading-[0.9] font-extrabold tracking-tighter uppercase sm:text-5xl">
            <Link to={href} className="transition-colors hover:text-blue">
              {product.name}
            </Link>
          </h3>
          <p className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl font-bold tabular-nums">{formatPrice(product.price)}</span>
            {off > 0 && (
              <>
                <span className="text-sm text-ink/40 line-through tabular-nums">{formatPrice(product.originalPrice)}</span>
                <span className="label font-bold text-blue">−{off}%</span>
              </>
            )}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 space-y-4 border-t border-ink/10 pt-6 text-sm">
          <div className="flex justify-between gap-4">
            <span className="label text-ink/50">Condition</span>
            <span className="text-right font-semibold">{conditionLabel(product)}</span>
          </div>
          <p className="text-sm leading-relaxed text-ink/65">{product.conditionDescription}</p>
        </Reveal>

        <Reveal delay={0.2} className="mt-8">
          <p className="label mb-3 text-ink/50">{error && !size ? <span className="text-danger">Select a size</span> : 'Size'}</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => {
                  setSize(s)
                  setError(false)
                }}
                className={cn(
                  'h-11 min-w-12 border px-3 text-xs font-semibold transition-colors',
                  size === s ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink',
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <button type="button" onClick={add} className={buttonClasses({ block: true, className: 'flex-1' })}>
              Add to bag <ArrowRight className="size-4" />
            </button>
            <WishlistButton product={product} variant="outline" className="size-12!" />
          </div>
        </Reveal>
      </div>
    </article>
  )
}

/** Section 04 — featured drop + the scroll-driven "Explore the drop" band. */
export default function FeaturedDrop() {
  const band = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: band, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-35%'])
  const xReverse = useTransform(scrollYProgress, [0, 1], reduce ? ['-35%', '-35%'] : ['-35%', '0%'])

  return (
    <section className="bg-white pt-20 sm:pt-28 lg:pt-36" aria-labelledby="drop-title">
      <div className="container-x">
        <div className="mb-12 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label mb-6 text-ink/50">(03) — Featured drop</p>
            <SplitText
              id="drop-title"
              className="heading-xl"
              lines={['This week', { text: 'on the rack.', className: 'accent normal-case text-blue' }]}
            />
          </div>
          <Reveal>
            <Link to="/shop?collection=trending" className="group inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] uppercase">
              <span className="link-underline">View all trending</span>
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <LeadProduct product={LEAD} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:col-span-3 lg:col-start-10 lg:grid-cols-1 lg:gap-16">
            {SUPPORT.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1} className={i === 1 ? 'mt-12 lg:mt-0' : ''}>
                <ProductCard product={p} sizes="(min-width: 1024px) 22vw, 50vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Link
        ref={band}
        to="/shop?collection=trending"
        data-cursor="Explore"
        className="group mt-24 block overflow-hidden border-y border-ink bg-ink py-6 text-white sm:mt-32 lg:py-10"
        aria-label="Explore the drop"
      >
        <motion.div style={{ x }} className="flex whitespace-nowrap" aria-hidden="true">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="flex shrink-0 items-center gap-[3vw] pr-[3vw] text-[12vw] leading-[0.9] font-extrabold tracking-tightest uppercase lg:text-[8vw]">
              Explore the drop
              <span className="accent text-[0.6em] tracking-normal text-blue normal-case">new every Friday</span>
              <ArrowRight className="size-[0.6em] shrink-0 text-blue transition-transform duration-700 group-hover:translate-x-4" strokeWidth={2.5} />
            </span>
          ))}
        </motion.div>
        <motion.div style={{ x: xReverse }} className="mt-3 flex whitespace-nowrap" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="text-outline-white shrink-0 pr-[3vw] text-[12vw] leading-[0.9] font-extrabold tracking-tightest uppercase transition-colors duration-500 group-hover:text-white lg:text-[8vw]">
              Pre-loved · New · Graded ·
            </span>
          ))}
        </motion.div>
      </Link>
    </section>
  )
}
