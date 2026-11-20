import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import SplitText from '../motion/SplitText'
import ProductCard from '../products/ProductCard'
import { cn } from '../../utils/format'

/**
 * Horizontal product rail. Native overflow scrolling (touch, trackpad, keyboard all work),
 * plus click-and-drag for mouse users, arrow buttons and a live progress bar.
 * A drag never triggers the link underneath it.
 */
export default function ProductRail({ label, title, accent, products, action, tone = 'light', className }) {
  const ref = useRef(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [dragging, setDragging] = useState(false)
  const progress = useMotionValue(0)
  const scaleX = useSpring(progress, { stiffness: 260, damping: 40 })
  const dark = tone === 'dark'

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < max - 4)
    progress.set(max > 0 ? Math.max(0.08, el.scrollLeft / max) : 1)
  }, [progress])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const scroll = (dir) => {
    const el = ref.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: 'smooth' })
  }

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { active: true, startX: e.clientX, startLeft: ref.current.scrollLeft, moved: 0 }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.active) return
    const dx = e.clientX - d.startX
    d.moved = Math.max(d.moved, Math.abs(dx))
    if (d.moved > 6 && !dragging) {
      setDragging(true)
      ref.current.setPointerCapture?.(e.pointerId)
    }
    if (d.moved > 6) ref.current.scrollLeft = d.startLeft - dx
  }
  const endDrag = () => {
    drag.current.active = false
    setDragging(false)
  }
  // Swallow the click that ends a drag so it doesn't open a product.
  const onClickCapture = (e) => {
    if (drag.current.moved > 6) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = 0
    }
  }

  const arrow = cn(
    'flex size-12 items-center justify-center border transition-colors disabled:pointer-events-none disabled:opacity-25',
    dark ? 'border-white/30 hover:border-blue hover:bg-blue' : 'border-ink/20 hover:border-ink hover:bg-ink hover:text-white',
  )

  return (
    <section
      className={cn(
        'overflow-hidden py-20 sm:py-28 lg:py-32',
        dark ? 'bg-ink text-white' : tone === 'mist' ? 'bg-mist' : 'bg-white',
        className,
      )}
    >
      <div className="container-x">
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            {label && <p className={cn('label mb-6', dark ? 'text-white/50' : 'text-ink/50')}>{label}</p>}
            <SplitText
              className="heading-xl"
              lines={[title, ...(accent ? [{ text: accent, className: 'accent normal-case text-blue' }] : [])]}
            />
          </div>
          <div className="flex items-center gap-6">
            {action && (
              <Link to={action.to} className="group inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] uppercase">
                <span className="link-underline">{action.label}</span>
                <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            )}
            <div className="hidden gap-2 md:flex">
              <button type="button" className={arrow} onClick={() => scroll(-1)} disabled={!canPrev} aria-label="Scroll left">
                <ArrowLeft className="size-4" />
              </button>
              <button type="button" className={arrow} onClick={() => scroll(1)} disabled={!canNext} aria-label="Scroll right">
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={ref}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        data-cursor="Drag"
        className={cn(
          'no-scrollbar flex gap-3 overflow-x-auto overscroll-x-contain px-4 select-none sm:gap-5 sm:px-6 lg:px-10 min-[1680px]:px-[calc((100vw-1680px)/2+2.5rem)]',
          dragging ? 'cursor-grabbing snap-none' : 'snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 lg:scroll-px-10',
        )}
        role="region"
        aria-label={`${title}${accent ? ` ${accent}` : ''} — scrollable list`}
        tabIndex={0}
      >
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            className="w-[68%] shrink-0 snap-start xs:w-[46%] sm:w-[36%] lg:w-[26%] xl:w-[21%]"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px -5% 0px 0px' }}
            transition={{ duration: 0.8, delay: Math.min(i, 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductCard product={product} tone={dark ? 'dark' : 'light'} sizes="(min-width: 1024px) 24vw, 60vw" />
          </motion.div>
        ))}
      </div>

      <div className="container-x mt-10">
        <div className={cn('h-px w-full', dark ? 'bg-white/15' : 'bg-ink/10')}>
          <motion.div className={cn('h-px origin-left', dark ? 'bg-white' : 'bg-ink')} style={{ scaleX }} />
        </div>
      </div>
    </section>
  )
}
