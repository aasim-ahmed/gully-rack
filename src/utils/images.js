// Image helpers. Product photos currently come from Unsplash; swap `buildImageUrl`
// when real product photography / a CDN is available.

export const FALLBACK_IMAGE = '/images/fallback.svg'

export function buildImageUrl(src, width = 800, height) {
  if (!src) return FALLBACK_IMAGE
  if (!src.startsWith('https://images.unsplash.com')) return src
  const url = new URL(src)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'crop')
  url.searchParams.set('q', '80')
  url.searchParams.set('w', String(width))
  if (height) url.searchParams.set('h', String(height))
  return url.toString()
}

export function buildSrcSet(src, widths = [400, 640, 900, 1200, 1600, 2000], ratio) {
  if (!src || !src.startsWith('https://images.unsplash.com')) return undefined
  return widths
    .map((w) => `${buildImageUrl(src, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`)
    .join(', ')
}

export const unsplash = (id) => `https://images.unsplash.com/photo-${id}`
