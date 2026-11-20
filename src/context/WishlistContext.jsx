import { createContext, useCallback, useContext, useMemo } from 'react'
import { toast } from 'sonner'
import { getProductById } from '../data/products'
import { useLocalStorage } from '../hooks/useLocalStorage'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useLocalStorage('gr:wishlist', [])

  const items = useMemo(() => ids.map(getProductById).filter(Boolean), [ids])

  const isWishlisted = useCallback((id) => ids.includes(id), [ids])

  const removeFromWishlist = useCallback(
    (id, { silent = false } = {}) => {
      setIds((prev) => prev.filter((x) => x !== id))
      if (!silent) toast('Removed from wishlist', { description: getProductById(id)?.name })
    },
    [setIds],
  )

  const toggleWishlist = useCallback(
    (product) => {
      if (ids.includes(product.id)) {
        removeFromWishlist(product.id)
      } else {
        setIds((prev) => [...prev, product.id])
        toast.success('Saved to wishlist', {
          description: product.name,
          action: {
            label: 'View',
            onClick: () => window.dispatchEvent(new CustomEvent('gr:navigate', { detail: '/wishlist' })),
          },
        })
      }
    },
    [ids, setIds, removeFromWishlist],
  )

  const value = useMemo(
    () => ({ items, count: items.length, isWishlisted, toggleWishlist, removeFromWishlist }),
    [items, isWishlisted, toggleWishlist, removeFromWishlist],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}
