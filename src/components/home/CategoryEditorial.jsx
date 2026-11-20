import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SmartImage from '../common/SmartImage'
import ImageReveal from '../motion/ImageReveal'
import SplitText from '../motion/SplitText'
import Reveal from '../motion/Reveal'
import { CATEGORIES } from '../../data/categories'
import { getAllProducts } from '../../data/products'
import { cn } from '../../utils/format'

const COUNTS = getAllProducts().reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {})

/*
 * Asymmetric composition. Each tile has its own column span, aspect ratio and vertical offset,
 * so the grid reads like a magazine spread rather than a row of cards.
 */
const LAYOUT = {
  't-shirts': { col: 'left', tile: 'lg:w-full', ratio: 'aspect-[4/5] lg:aspect-[6/5]', title: 'T-Shirts', mobile: 'w-full' },
  shirts: { col: 'right', tile: 'lg:w-[86%] lg:self-end', ratio: 'aspect-[3/4]', title: 'Shirts', mobile: 'w-[78%] self-end' },
  'hoodies-sweatshirts': { col: 'left', tile: 'lg:w-[68%] lg:self-center', ratio: 'aspect-square', title: 'Hoodies', mobile: 'w-[86%]' },
  'jeans-trousers': { col: 'right', tile: 'lg:w-full', ratio: 'aspect-[4/5]', title: 'Jeans', mobile: 'w-full' },
  jackets: { col: 'left', tile: 'lg:w-full', ratio: 'aspect-[5/4]', title: 'Jackets', mobile: 'w-[82%] self-end' },
  accessories: { col: 'right', tile: 'lg:w-[82%] lg:self-end', ratio: 'aspect-[4/5]', title: 'Accessories', mobile: 'w-[86%]' },
}

function CategoryTile({ category, index }) {
  const layout = LAYOUT[category.slug]
  const right = index % 2 === 1
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className={cn('group relative block', layout.mobile, layout.tile)}
      data-cursor="Shop"
    >
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="label text-white/50">(0{index + 1})</span>
        <span className="label text-white/50">
          {COUNTS[category.slug] || 0} pieces
        </span>
      </div>
      <ImageReveal className={cn('bg-graphite', layout.ratio)} direction={right ? 'down' : 'up'}>
        <SmartImage
          src={category.image}
          alt={`${category.name} at GULLY RACK`}
          width={1100}
          sizes="(min-width: 1024px) 50vw, 90vw"
          className="h-full bg-graphite!"
          imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
        />
        <span className="absolute inset-0 bg-ink/15 transition-colors duration-700 group-hover:bg-ink/0" aria-hidden="true" />
      </ImageReveal>

      <div
        className={cn(
          'pointer-events-none relative z-10 -mt-[0.55em] text-[15vw] leading-[0.85] font-extrabold tracking-tightest uppercase',
          right ? 'lg:text-[5vw]' : 'lg:text-[6.4vw]',
          right ? 'text-right lg:-mr-[0.2em]' : 'lg:-ml-[0.08em]',
        )}
      >
        <span className="inline-block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2">
          {layout.title}
        </span>
      </div>

      <div className={cn('mt-3 flex items-center gap-3', right && 'justify-end')}>
        <p className="text-sm text-white/55">{category.blurb}</p>
        <span className="flex size-8 shrink-0 items-center justify-center border border-white/25 transition-colors duration-500 group-hover:border-blue group-hover:bg-blue">
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </div>
    </Link>
  )
}

/** Section 03 — Shop by category. */
export default function CategoryEditorial() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28 lg:py-36" aria-labelledby="categories-title">
      <div className="container-x">
        <div className="mb-14 grid grid-cols-1 items-end gap-8 lg:mb-24 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="label mb-6 text-white/50">(02) — Shop by category</p>
            <SplitText
              id="categories-title"
              className="heading-xl"
              lines={['Dig through', { text: 'the rack.', className: 'accent normal-case text-blue' }]}
            />
          </div>
          <Reveal className="lg:col-span-4">
            <p className="max-w-sm text-sm leading-relaxed text-white/60 lg:ml-auto">
              Six racks, restocked every Friday. Tap one and we’ll take you straight to it.
            </p>
          </Reveal>
        </div>

        {/* Phones & tablets: one staggered column, in catalogue order. */}
        <div className="flex flex-col gap-16 lg:hidden">
          {CATEGORIES.map((c, i) => (
            <CategoryTile key={c.slug} category={c} index={i} />
          ))}
        </div>
        {/* Desktop: two independent columns of different widths, offset vertically. */}
        <div className="hidden items-start justify-between lg:flex">
          {['left', 'right'].map((col) => (
            <div key={col} className={cn('flex flex-col gap-28', col === 'left' ? 'w-[56%]' : 'mt-56 w-[37%]')}>
              {CATEGORIES.map((c, i) => LAYOUT[c.slug].col === col && <CategoryTile key={c.slug} category={c} index={i} />)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
