/** "N°014" — the catalogue number gives every piece a tag-like identity. */
export const productNumber = (product) => `N°${product.id.replace(/\D/g, '').padStart(3, '0')}`

/** Condition shown everywhere a product appears. Pre-loved items always carry their grade. */
export const conditionLabel = (product) =>
  product.condition === 'Pre-Loved' ? `Pre-Loved · ${product.conditionGrade}` : 'New'

/** Compact size summary: "S–XXL" for long runs, "M · L" for short ones. */
export const sizeSummary = (sizes) => (sizes.length > 3 ? `${sizes[0]}–${sizes.at(-1)}` : sizes.join(' · '))
