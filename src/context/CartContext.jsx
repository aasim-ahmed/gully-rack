import { createContext, useCallback, useContext, useMemo } from 'react'
import { toast } from 'sonner'
import { getProductById } from '../data/products'
import { SHIPPING } from '../data/site'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CartContext = createContext(null)

const lineKey = (id, size) => `${id}__${size}`

export function CartProvider({ children }) {
  // Only ids, sizes and quantities are persisted; product data is resolved from the catalogue
  // so price or stock changes are always reflected.
  const [lines, setLines] = useLocalStorage('gr:cart', [])

  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const product = getProductById(line.id)
          if (!product) return null
          return { ...line, key: lineKey(line.id, line.size), product, lineTotal: product.price * line.qty }
        })
        .filter(Boolean),
    [lines],
  )

  const addItem = useCallback(
    (product, size, qty = 1) => {
      if (product.stock <= 0) {
        toast.error('This piece has sold out.')
        return false
      }
      const existing = lines.find((l) => l.id === product.id && l.size === size)
      const current = existing?.qty || 0
      const allowed = Math.min(qty, product.stock - current)
      if (allowed <= 0) {
        toast.error(
          product.stock === 1
            ? 'This one-of-one piece is already in your bag.'
            : `Only ${product.stock} available — they’re all in your bag.`,
        )
        return false
      }
      setLines((prev) =>
        existing
          ? prev.map((l) => (l.id === product.id && l.size === size ? { ...l, qty: l.qty + allowed } : l))
          : [...prev, { id: product.id, size, qty: allowed }],
      )
      toast.success('Added to bag', {
        description: `${product.name} · ${size}${allowed > 1 ? ` × ${allowed}` : ''}`,
        action: { label: 'View bag', onClick: () => window.dispatchEvent(new Event('gr:open-cart')) },
      })
      return true
    },
    [lines, setLines],
  )

  const updateQty = useCallback(
    (key, qty) => {
      setLines((prev) =>
        prev.map((l) => {
          if (lineKey(l.id, l.size) !== key) return l
          const stock = getProductById(l.id)?.stock ?? 1
          return { ...l, qty: Math.max(1, Math.min(qty, stock)) }
        }),
      )
    },
    [setLines],
  )

  const removeItem = useCallback(
    (key, { silent = false } = {}) => {
      const line = lines.find((l) => lineKey(l.id, l.size) === key)
      setLines((prev) => prev.filter((l) => lineKey(l.id, l.size) !== key))
      if (line && !silent) {
        toast('Removed from bag', {
          description: getProductById(line.id)?.name,
          action: { label: 'Undo', onClick: () => setLines((prev) => [...prev, line]) },
        })
      }
    },
    [lines, setLines],
  )

  const clearCart = useCallback(() => setLines([]), [setLines])

  const totals = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0)
    const subtotal = items.reduce((n, i) => n + i.lineTotal, 0)
    const savings = items.reduce(
      (n, i) => n + (i.product.originalPrice ? (i.product.originalPrice - i.product.price) * i.qty : 0),
      0,
    )
    const qualifiesFreeShipping = subtotal >= SHIPPING.freeThreshold
    const shipping = count === 0 || qualifiesFreeShipping ? 0 : SHIPPING.standardFee
    return {
      count,
      subtotal,
      savings,
      shipping,
      total: subtotal + shipping,
      qualifiesFreeShipping,
      remainingForFreeShipping: Math.max(0, SHIPPING.freeThreshold - subtotal),
    }
  }, [items])

  const value = useMemo(
    () => ({ items, ...totals, addItem, updateQty, removeItem, clearCart }),
    [items, totals, addItem, updateQty, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
