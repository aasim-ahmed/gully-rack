import { unsplash } from '../utils/images'

export const CATEGORIES = [
  {
    slug: 't-shirts',
    name: 'T-Shirts',
    blurb: 'Heavyweight blanks & one-off graphics',
    image: unsplash('1622445275463-afa2ab738c34'),
  },
  {
    slug: 'shirts',
    name: 'Shirts',
    blurb: 'Flannels, chambray & easy linen',
    image: unsplash('1620012253295-c15cc3e65df4'),
  },
  {
    slug: 'hoodies-sweatshirts',
    name: 'Hoodies & Sweatshirts',
    blurb: 'Layers that get better with wear',
    image: unsplash('1548126032-079a0fb0099d'),
  },
  {
    slug: 'jeans-trousers',
    name: 'Jeans & Trousers',
    blurb: 'Broken-in denim, cargos & chinos',
    image: unsplash('1604176354204-9268737828e4'),
  },
  {
    slug: 'jackets',
    name: 'Jackets',
    blurb: 'Leather, denim & bombers',
    image: unsplash('1516257984-b1b4d707412e'),
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    blurb: 'Caps, beanies, bags & shades',
    image: unsplash('1572307480813-ceb0e59d8325'),
  },
]

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug)

export const GENDERS = ['Men', 'Women', 'Unisex']

export const CONDITIONS = ['New', 'Pre-Loved']

export const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'One Size']

export const PRICE_RANGES = [
  { id: 'under-750', label: 'Under ₹750', min: 0, max: 749 },
  { id: '750-1500', label: '₹750 – ₹1,500', min: 750, max: 1500 },
  { id: '1500-2500', label: '₹1,500 – ₹2,500', min: 1500, max: 2500 },
  { id: 'over-2500', label: 'Above ₹2,500', min: 2501, max: Infinity },
]

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'popular', label: 'Popular' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
]

export const COLLECTIONS = {
  new: { name: 'New Arrivals', blurb: 'Fresh drops, added to the rack this week.' },
  trending: { name: 'Trending Now', blurb: 'The pieces everyone is eyeing right now.' },
}
