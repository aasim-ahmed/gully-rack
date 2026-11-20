import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Shared overlay state: cart drawer, search and the full-screen menu.
 * Lives inside the router so every overlay closes when the URL changes.
 * Code outside React (toast actions) can open the bag with: window.dispatchEvent(new Event('gr:open-cart')).
 */
const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const url = location.pathname + location.search

  // Close overlays on navigation (state adjustment during render, per the React docs).
  const [lastUrl, setLastUrl] = useState(url)
  if (lastUrl !== url) {
    setLastUrl(url)
    setCartOpen(false)
    setSearchOpen(false)
    setMenuOpen(false)
  }

  const openCart = useCallback(() => {
    setSearchOpen(false)
    setMenuOpen(false)
    setCartOpen(true)
  }, [])
  const openSearch = useCallback(() => {
    setCartOpen(false)
    setMenuOpen(false)
    setSearchOpen(true)
  }, [])
  const openMenu = useCallback(() => {
    setCartOpen(false)
    setSearchOpen(false)
    setMenuOpen(true)
  }, [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const onOpen = () => openCart()
    window.addEventListener('gr:open-cart', onOpen)
    return () => window.removeEventListener('gr:open-cart', onOpen)
  }, [openCart])

  // "/" opens search, like most modern storefronts.
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) && !e.target.isContentEditable) {
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSearch])

  const value = useMemo(
    () => ({ cartOpen, searchOpen, menuOpen, openCart, closeCart, openSearch, closeSearch, openMenu, closeMenu }),
    [cartOpen, searchOpen, menuOpen, openCart, closeCart, openSearch, closeSearch, openMenu, closeMenu],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>')
  return ctx
}
