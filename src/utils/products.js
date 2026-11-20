import { CATEGORIES, PRICE_RANGES, SIZE_ORDER } from '../data/categories'

/** Filter keys stored in the URL. List filters are comma-separated. */
export const LIST_FILTERS = ['category', 'gender', 'size', 'condition']

export function readFilters(searchParams) {
  const list = (key) => (searchParams.get(key) || '').split(',').filter(Boolean)
  return {
    q: searchParams.get('q') || '',
    category: list('category'),
    gender: list('gender'),
    size: list('size'),
    condition: list('condition'),
    price: searchParams.get('price') || '',
    collection: searchParams.get('collection') || '',
    inStock: searchParams.get('inStock') === '1',
    sort: searchParams.get('sort') || 'newest',
  }
}

export function countActiveFilters(filters) {
  return (
    LIST_FILTERS.reduce((n, key) => n + filters[key].length, 0) +
    (filters.price ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.collection ? 1 : 0) +
    (filters.q ? 1 : 0)
  )
}

const normalise = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '')

export function matchesSearch(product, query) {
  if (!query) return true
  const category = CATEGORIES.find((c) => c.slug === product.category)?.name || ''
  const haystack = normalise(
    [product.name, product.description, category, product.gender, product.condition].join(' '),
  )
  return normalise(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

export function filterProducts(products, filters) {
  const range = PRICE_RANGES.find((r) => r.id === filters.price)
  return products.filter((p) => {
    if (!matchesSearch(p, filters.q)) return false
    if (filters.category.length && !filters.category.includes(p.category)) return false
    if (filters.gender.length && !filters.gender.includes(p.gender)) return false
    if (filters.condition.length && !filters.condition.includes(p.condition)) return false
    if (filters.size.length && !p.sizes.some((s) => filters.size.includes(s))) return false
    if (range && (p.price < range.min || p.price > range.max)) return false
    if (filters.inStock && p.stock <= 0) return false
    if (filters.collection === 'new' && !p.newArrival) return false
    if (filters.collection === 'trending' && !p.featured) return false
    return true
  })
}

export function sortProducts(products, sort) {
  const list = [...products]
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'popular':
      return list.sort((a, b) => b.popularity - a.popularity)
    case 'newest':
    default:
      return list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
  }
}

export function getAvailableSizes(products) {
  const set = new Set(products.flatMap((p) => p.sizes))
  return SIZE_ORDER.filter((s) => set.has(s))
}
