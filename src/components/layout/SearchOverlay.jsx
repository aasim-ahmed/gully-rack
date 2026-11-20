import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Search, X } from 'lucide-react'
import SmartImage from '../common/SmartImage'
import { getAllProducts } from '../../data/products'
import { matchesSearch } from '../../utils/products'
import { formatPrice } from '../../utils/format'
import { useEscapeKey, useLockBodyScroll } from '../../hooks/useLockBodyScroll'

const POPULAR = ['Hoodie', 'Leather jacket', 'Graphic tee', 'Jeans', 'Cargo', 'Flannel']

export default function SearchOverlay({ open, onClose: close }) {
  const [query, setQuery] = useState('')
  const onClose = useCallback(() => {
    setQuery('')
    close()
  }, [close])
  const inputRef = useRef(null)
  const navigate = useNavigate()
  useLockBodyScroll(open)
  useEscapeKey(open, onClose)

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim()
    if (q.length < 2) return []
    const lower = q.toLowerCase()
    // Name matches first, then matches found only in descriptions.
    return getAllProducts()
      .filter((p) => matchesSearch(p, q))
      .sort((a, b) => Number(b.name.toLowerCase().includes(lower)) - Number(a.name.toLowerCase().includes(lower)))
  }, [query])

  const submit = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/shop?q=${encodeURIComponent(q)}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search">
          <motion.button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-ink/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative max-h-[92vh] overflow-y-auto bg-ink text-white"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="container-x py-6 sm:py-12">
              <form onSubmit={submit} role="search" className="flex items-center gap-3 border-b border-white/25 pb-4 focus-within:border-blue transition-colors">
                <Search className="size-5 shrink-0 sm:size-6" aria-hidden="true" />
                <label htmlFor="site-search" className="sr-only">
                  Search products
                </label>
                <input
                  ref={inputRef}
                  id="site-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the rack…"
                  className="min-w-0 flex-1 bg-transparent text-2xl font-extrabold tracking-tighter uppercase outline-none placeholder:text-white/25 sm:text-5xl lg:text-6xl"
                  autoComplete="off"
                />
                <button type="button" onClick={onClose} className="p-2" aria-label="Close search">
                  <X className="size-5 sm:size-6" />
                </button>
              </form>

              {query.trim().length < 2 ? (
                <div className="py-6">
                  <p className="eyebrow mb-4 text-white/40">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="border border-white/20 px-4 py-2 text-xs font-medium transition-colors hover:border-blue hover:bg-blue"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p className="py-10 text-sm text-white/60">
                  No results for “{query.trim()}”. Try a different word, like “hoodie” or “denim”.
                </p>
              ) : (
                <div className="py-6">
                  <p className="eyebrow mb-4 text-white/40" aria-live="polite">
                    {results.length} {results.length === 1 ? 'result' : 'results'}
                  </p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                    {results.slice(0, 6).map((p) => (
                      <li key={p.id}>
                        <Link to={`/product/${p.slug}`} onClick={onClose} className="group block">
                          <SmartImage src={p.images[0]} alt={p.name} ratio={1.25} width={300} sizes="200px" className="bg-graphite!" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                          <p className="mt-2 line-clamp-1 text-xs font-semibold uppercase group-hover:text-blue">
                            {p.name}
                          </p>
                          <p className="text-xs text-white/60">{p.condition === 'Pre-Loved' ? `Pre-Loved · ${p.conditionGrade}` : 'New'} · {formatPrice(p.price)}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {results.length > 6 && (
                    <button
                      type="button"
                      onClick={submit}
                      className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase hover:text-blue"
                    >
                      See all {results.length} results <ArrowRight className="size-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
