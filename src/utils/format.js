const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export const formatPrice = (amount) => inr.format(amount)

export const discountPercent = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export const pluralize = (count, word, plural = `${word}s`) =>
  `${count} ${count === 1 ? word : plural}`

export const cn = (...classes) => classes.filter(Boolean).join(' ')
