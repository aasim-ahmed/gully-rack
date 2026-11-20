import { useRef, useState } from 'react'
import SmartImage from '../common/SmartImage'
import { cn } from '../../utils/format'

/** Desktop frame: hover to zoom, with the zoom origin following the cursor. */
function ZoomFrame({ src, alt, priority, className }) {
  const [origin, setOrigin] = useState('50% 50%')
  const [zoom, setZoom] = useState(false)
  return (
    <div
      className={cn('relative cursor-zoom-in overflow-hidden bg-mist', className)}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
      }}
    >
      <SmartImage
        src={src}
        alt={alt}
        ratio={1.25}
        width={1400}
        sizes="(min-width: 1024px) 55vw, 100vw"
        priority={priority}
        imgClassName="transition-transform duration-500 ease-out"
        style={{ transformOrigin: origin, transform: zoom ? 'scale(1.6)' : 'scale(1)' }}
      />
    </div>
  )
}

/**
 * Product imagery.
 * Phones/tablets: full-width swipe gallery (native scroll-snap) with a counter and dots.
 * Desktop: every shot stacked large, editorial style — the first full width, the rest in pairs.
 */
export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0)
  const scroller = useRef(null)
  const count = images.length

  const goTo = (i) => {
    const el = scroller.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div aria-label={`${name} images`} role="group">
      {/* Mobile / tablet */}
      <div className="relative lg:hidden">
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget
            setActive(Math.round(el.scrollLeft / el.clientWidth))
          }}
          tabIndex={0}
          aria-label="Swipe for more images"
        >
          {images.map((img, i) => (
            <div key={img} className="w-full shrink-0 snap-center">
              <SmartImage
                src={img}
                alt={`${name} — image ${i + 1} of ${count}`}
                ratio={1.25}
                width={1000}
                sizes="100vw"
                priority={i === 0}
                draggable={false}
              />
            </div>
          ))}
        </div>
        {count > 1 && (
          <>
            <p className="label absolute top-3 right-3 bg-white px-1.5 py-1 text-ink tabular-nums">
              {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </p>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={active === i}
                  className="flex h-6 items-center"
                >
                  <span
                    className={cn('block h-0.5 transition-all duration-500', active === i ? 'w-8 bg-ink' : 'w-4 bg-ink/30')}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden grid-cols-2 gap-2 lg:grid">
        {images.map((img, i) => (
          <div key={img} className={cn('relative', (i === 0 || (count === 2 && i === 1)) && 'col-span-2')}>
            <ZoomFrame src={img} alt={`${name} — image ${i + 1} of ${count}`} priority={i === 0} />
            <span className="label pointer-events-none absolute bottom-3 left-3 bg-white px-1.5 py-1 text-ink">
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
