import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronDown, LayoutGrid, Search, SearchX, SlidersHorizontal, Square, X } from 'lucide-react'
import Seo from '../components/common/Seo'
import Breadcrumbs from '../components/common/Breadcrumbs'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FilterPanel from '../components/products/FilterPanel'
import FilterDrawer from '../components/products/FilterDrawer'
import ProductGrid from '../components/products/ProductGrid'
import { getAllProducts } from '../data/products'
import { CATEGORIES, COLLECTIONS, PRICE_RANGES, SORT_OPTIONS, getCategory } from '../data/categories'
import {
  LIST_FILTERS,
  countActiveFilters,
  filterProducts,
  getAvailableSizes,
  readFilters,
  sortProducts,
} from '../utils/products'
import SplitText from '../components/motion/SplitText'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { cn, pluralize } from '../utils/format'

const ALL = getAllProducts()
const SIZES = getAvailableSizes(ALL)
const CATEGORY_COUNTS = ALL.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {})

/** Editorial break inside the grid — explains grading where shoppers are deciding. */
function Interlude() {
  return (
    <Link
      to="/shop?condition=Pre-Loved"
      className="group flex h-full min-h-72 flex-col justify-between bg-blue p-6 text-white sm:p-8"
    >
      <p className="label text-white/80">[ How grading works ]</p>
      <div>
        <p className="text-3xl leading-[0.92] font-extrabold tracking-tighter uppercase sm:text-5xl">
          Pre-loved means <span className="accent normal-case text-ink">one-of-one.</span>
        </p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85">
          Every piece is graded Excellent, Very Good or Good, with flaws written down on the product page.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 border-b border-white pb-1 text-[11px] font-semibold tracking-[0.2em] uppercase">
          Shop pre-loved <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </div>
    </Link>
  )
}

/** Facet counts: for each group, count matches with every *other* active filter applied. */
function buildCounts(filters) {
  const without = (key, empty) => filterProducts(ALL, { ...filters, [key]: empty })
  const tally = (list, fn) =>
    list.reduce((acc, p) => {
      ;[].concat(fn(p)).forEach((k) => (acc[k] = (acc[k] || 0) + 1))
      return acc
    }, {})
  const byPrice = without('price', '')
  return {
    category: tally(without('category', []), (p) => p.category),
    gender: tally(without('gender', []), (p) => p.gender),
    condition: tally(without('condition', []), (p) => p.condition),
    price: Object.fromEntries(
      PRICE_RANGES.map((r) => [r.id, byPrice.filter((p) => p.price >= r.min && p.price <= r.max).length]),
    ),
  }
}

function pageHeading(filters) {
  if (filters.collection && COLLECTIONS[filters.collection]) return COLLECTIONS[filters.collection]
  if (filters.category.length === 1) {
    const c = getCategory(filters.category[0])
    if (c) return { name: c.name, blurb: c.blurb }
  }
  if (filters.condition.length === 1 && filters.condition[0] === 'Pre-Loved')
    return { name: 'Pre-Loved', blurb: 'One-of-one finds, hand-checked and honestly graded.' }
  if (filters.condition.length === 1 && filters.condition[0] === 'New')
    return { name: 'New Essentials', blurb: 'Unworn basics from our own line, restocked regularly.' }
  if (filters.q) return { name: `Search: “${filters.q}”`, blurb: null }
  return { name: 'Shop All', blurb: 'Curated pre-loved pieces and new essentials. Fresh drops every Friday.' }
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => readFilters(searchParams), [searchParams])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [view, setView] = useLocalStorage('gr:shop-view', 3)
  const [searchInput, setSearchInput] = useState(filters.q)

  // Keep the inline search box in sync with navbar searches.
  const [lastQ, setLastQ] = useState(filters.q)
  if (lastQ !== filters.q) {
    setLastQ(filters.q)
    setSearchInput(filters.q)
  }

  const deferredFilters = useDeferredValue(filters)
  const results = useMemo(
    () => sortProducts(filterProducts(ALL, deferredFilters), deferredFilters.sort),
    [deferredFilters],
  )
  const counts = useMemo(() => buildCounts(deferredFilters), [deferredFilters])
  const activeCount = countActiveFilters(filters)
  const heading = pageHeading(filters)

  const update = useCallback(
    (mutate) => {
      // Read the live URL rather than the render-time params so rapid successive
      // filter clicks compose instead of overwriting each other.
      const next = new URLSearchParams(window.location.search)
      mutate(next)
      setSearchParams(next, { replace: true, preventScrollReset: true })
    },
    [setSearchParams],
  )

  const setParam = useCallback(
    (key, value) =>
      update((p) => {
        if (value) p.set(key, value)
        else p.delete(key)
      }),
    [update],
  )

  const toggle = useCallback(
    (key, value) =>
      update((p) => {
        const list = (p.get(key) || '').split(',').filter(Boolean)
        const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
        if (next.length) p.set(key, next.join(','))
        else p.delete(key)
      }),
    [update],
  )

  const clearAll = () => {
    setSearchInput('')
    setSearchParams(filters.sort !== 'newest' ? { sort: filters.sort } : {}, { replace: true })
  }

  const submitSearch = (e) => {
    e.preventDefault()
    setParam('q', searchInput.trim())
  }

  const chips = [
    ...(filters.q ? [{ key: 'q', label: `“${filters.q}”`, onRemove: () => setParam('q', '') }] : []),
    ...(filters.collection && COLLECTIONS[filters.collection]
      ? [{ key: 'collection', label: COLLECTIONS[filters.collection].name, onRemove: () => setParam('collection', '') }]
      : []),
    ...LIST_FILTERS.flatMap((key) =>
      filters[key].map((value) => ({
        key: `${key}-${value}`,
        label: key === 'category' ? getCategory(value)?.name || value : key === 'size' ? `Size ${value}` : value,
        onRemove: () => toggle(key, value),
      })),
    ),
    ...(filters.price
      ? [
          {
            key: 'price',
            label: PRICE_RANGES.find((r) => r.id === filters.price)?.label,
            onRemove: () => setParam('price', ''),
          },
        ]
      : []),
    ...(filters.inStock ? [{ key: 'inStock', label: 'In stock', onRemove: () => setParam('inStock', '') }] : []),
  ]

  const panel = (
    <FilterPanel filters={filters} sizes={SIZES} counts={counts} onToggle={toggle} onSet={setParam} />
  )

  return (
    <>
      <Seo
        title={heading.name.replace(/[“”]/g, '"')}
        description={`${heading.blurb || 'Shop curated streetwear'} Browse ${results.length} pieces at GULLY RACK.`}
        noIndex={!!filters.q}
      />

      <header className="relative overflow-hidden bg-ink text-white">
        <div className="container-x pt-8 pb-8 sm:pt-12">
          <Breadcrumbs items={[{ label: 'Shop', to: '/shop' }, ...(heading.name !== 'Shop All' ? [{ label: heading.name }] : [])]} />
          <div className="mt-10 flex flex-col gap-8 lg:mt-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <SplitText
                key={heading.name}
                as="h1"
                trigger="mount"
                stagger={0.05}
                className="min-w-0 text-[13vw] leading-[0.82] font-extrabold tracking-tightest break-words uppercase sm:text-[10vw] lg:text-[7.5vw]"
                lines={[heading.name]}
              />
              <span className="label mt-1 shrink-0 text-blue sm:mt-3" aria-hidden="true">
                ({results.length})
              </span>
            </div>
            <div className="w-full lg:max-w-sm">
              {heading.blurb && <p className="mb-5 text-sm leading-relaxed text-white/60">{heading.blurb}</p>}
              <form onSubmit={submitSearch} role="search" className="relative">
                <label htmlFor="shop-search" className="sr-only">
                  Search the shop
                </label>
                <Search className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-white/50" />
                <input
                  id="shop-search"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onBlur={() => searchInput.trim() !== filters.q && setParam('q', searchInput.trim())}
                  placeholder="Search the rack"
                  className="h-12 w-full border-b border-white/30 bg-transparent pr-2 pl-7 text-sm text-white transition-colors outline-none placeholder:text-white/40 focus:border-blue"
                />
              </form>
            </div>
          </div>

          <nav
            aria-label="Categories"
            className="no-scrollbar -mx-4 mt-10 flex gap-6 overflow-x-auto border-t border-white/15 px-4 pt-5 sm:mx-0 sm:gap-9 sm:px-0 lg:mt-14"
          >
            {[{ slug: '', name: 'All', count: ALL.length }, ...CATEGORIES.map((c) => ({ ...c, count: CATEGORY_COUNTS[c.slug] || 0 }))].map(
              (c) => {
                const active = c.slug
                  ? filters.category.length === 1 && filters.category[0] === c.slug
                  : filters.category.length === 0
                return (
                  <button
                    key={c.slug || 'all'}
                    type="button"
                    onClick={() =>
                      c.slug ? setParam('category', active ? '' : c.slug) : update((p) => p.delete('category'))
                    }
                    aria-pressed={active}
                    className={cn(
                      'group flex shrink-0 items-start gap-1 text-xl font-extrabold tracking-tighter whitespace-nowrap uppercase transition-colors duration-300 sm:text-2xl lg:text-3xl',
                      active ? 'text-white' : 'text-white/30 hover:text-white',
                    )}
                  >
                    {c.name}
                    <span className={cn('label mt-0.5 tracking-normal', active ? 'text-blue' : 'text-white/30')}>
                      {c.count}
                    </span>
                  </button>
                )
              },
            )}
          </nav>
        </div>
      </header>

      <div className="container-x py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-24">
              <div className="flex items-center justify-between pb-2">
                <p className="text-2xl font-extrabold tracking-tighter uppercase">Filter</p>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs font-semibold text-ink/60 underline underline-offset-4 hover:text-ink"
                  >
                    Clear all ({activeCount})
                  </button>
                )}
              </div>
              {panel}
            </div>
          </aside>

          <section aria-labelledby="results-count" className="min-w-0">
            <div className="mb-6 flex items-center justify-between gap-3">
              <p id="results-count" className="text-xs font-medium whitespace-nowrap text-ink/60 max-sm:sr-only" aria-live="polite">
                {pluralize(results.length, 'piece')}
              </p>
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex shrink-0 border border-ink/15" role="group" aria-label="Grid size">
                  {[
                    { id: 3, icon: LayoutGrid, label: 'Show more products per row' },
                    { id: 'large', icon: Square, label: 'Show larger product images' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setView(v.id)}
                      aria-pressed={view === v.id}
                      aria-label={v.label}
                      className={cn(
                        'flex size-10 items-center justify-center transition-colors',
                        view === v.id ? 'bg-ink text-white' : 'hover:bg-mist',
                      )}
                    >
                      <v.icon className="size-4" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex h-10 shrink-0 items-center gap-2 border border-ink/15 px-3 text-[11px] font-semibold tracking-[0.12em] uppercase sm:px-4 lg:hidden"
                >
                  <SlidersHorizontal className="size-4" /> Filter
                  {activeCount > 0 && <span className="text-blue">({activeCount})</span>}
                </button>
                <label className="relative min-w-0">
                  <span className="sr-only">Sort by</span>
                  <select
                    value={filters.sort}
                    onChange={(e) => setParam('sort', e.target.value === 'newest' ? '' : e.target.value)}
                    className="h-10 w-full max-w-52 min-w-0 cursor-pointer appearance-none truncate border border-ink/15 bg-white pr-9 pl-3 sm:pl-4 text-[11px] font-semibold tracking-[0.12em] uppercase outline-none hover:border-ink focus:border-ink"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </label>
              </div>
            </div>

            {chips.length > 0 && (
              <ul className="mb-8 flex flex-wrap gap-2" aria-label="Active filters">
                {chips.map((chip) => (
                  <li key={chip.key}>
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      className="flex h-8 items-center gap-1.5 border border-ink px-3 text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors hover:bg-ink hover:text-white"
                      aria-label={`Remove filter ${chip.label}`}
                    >
                      {chip.label} <X className="size-3" />
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="h-8 px-2 text-xs font-semibold underline underline-offset-4"
                  >
                    Clear all
                  </button>
                </li>
              </ul>
            )}

            {results.length > 0 ? (
              <ProductGrid
                products={results}
                columns={view === 'large' ? 'large' : 3}
                interlude={activeCount === 0 && !filters.collection && !filters.q ? <Interlude /> : null}
              />
            ) : (
              <EmptyState
                icon={SearchX}
                title="Nothing on this rack"
                text="No pieces match those filters right now. Try removing a filter or two — new drops land every Friday."
              />
            )}
            {results.length === 0 && activeCount > 0 && (
              <div className="-mt-12 flex justify-center pb-12">
                <Button onClick={clearAll}>Clear all filters</Button>
              </div>
            )}
          </section>
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onClear={clearAll}
        resultCount={results.length}
        activeCount={activeCount}
      >
        {panel}
      </FilterDrawer>
    </>
  )
}
