import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Home, Search, ShoppingBag, Store } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useUI } from '../../context/UIContext'
import { AnimatedCount } from './Navbar'
import { cn } from '../../utils/format'

const item = 'relative flex flex-1 flex-col items-center justify-center gap-1 text-[9px] font-semibold tracking-[0.16em] uppercase'

/** Thumb-zone navigation for phones and small tablets. Hidden on desktop and at checkout. */
export default function MobileDock() {
  const { pathname } = useLocation()
  const { count: cartCount } = useCart()
  const { count: wishCount } = useWishlist()
  const ui = useUI()

  if (pathname === '/checkout') return null

  const indicator = (
    <motion.span layoutId="dock-indicator" className="absolute top-0 h-0.5 w-8 bg-blue" aria-hidden="true" />
  )

  const linkClass = ({ isActive }) => cn(item, isActive ? 'text-white' : 'text-white/55')

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink pb-[env(safe-area-inset-bottom)] text-white lg:hidden"
    >
      <div className="flex h-16">
        <NavLink to="/" end className={linkClass}>
          {({ isActive }) => (
            <>
              {isActive && indicator}
              <Home className="size-5" strokeWidth={1.75} /> Home
            </>
          )}
        </NavLink>
        <NavLink to="/shop" className={linkClass}>
          {({ isActive }) => (
            <>
              {isActive && indicator}
              <Store className="size-5" strokeWidth={1.75} /> Shop
            </>
          )}
        </NavLink>
        <button type="button" onClick={ui.openSearch} className={cn(item, 'text-white/55')}>
          <Search className="size-5" strokeWidth={1.75} /> Search
        </button>
        <NavLink to="/wishlist" className={linkClass} aria-label={`Wishlist, ${wishCount} items`}>
          {({ isActive }) => (
            <>
              {isActive && indicator}
              <span className="relative">
                <Heart className={cn('size-5', wishCount > 0 && 'fill-blue text-blue')} strokeWidth={1.75} />
              </span>
              Saved
            </>
          )}
        </NavLink>
        <button
          type="button"
          onClick={ui.openCart}
          className={cn(item, ui.cartOpen ? 'text-white' : 'text-white/55')}
          aria-label={`Open bag, ${cartCount} items`}
        >
          <span className="relative">
            <ShoppingBag className="size-5" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center bg-blue px-1 text-[9px] leading-none font-bold tracking-normal text-white">
                <AnimatedCount value={cartCount} />
              </span>
            )}
          </span>
          Bag
        </button>
      </div>
    </nav>
  )
}
