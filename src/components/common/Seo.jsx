import { useLocation } from 'react-router-dom'
import { SITE } from '../../data/site'

/**
 * Page-level SEO. React 19 hoists <title>, <meta> and <link> into <head> automatically.
 */
export default function Seo({ title, description, image, type = 'website', noIndex = false }) {
  const { pathname } = useLocation()
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`
  const desc =
    description ||
    'Curated streetwear and essentials. Hand-picked pre-loved and new tees, hoodies, jackets, denim and accessories at honest prices.'
  const url = `${SITE.url}${pathname}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {noIndex && <meta name="robots" content="noindex" />}
    </>
  )
}
