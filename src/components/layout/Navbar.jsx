import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Search } from 'lucide-react'
import Logo from '../common/Logo'
import FullMenu from './FullMenu'
import SearchOverlay from './SearchOverlay'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useUI } from '../../context/UIContext'
import { EASE_OUT } from '../motion/easing'
import { cn } from '../../utils/format'

const PRIMARY = [
  { label: 'Shop', to: '/shop' },
  { label: 'New In', to: '/shop?collection=new' },
  { label: 'Pre-Loved', to: '/shop?condition=Pre-Loved' },
]

/** Count that pops when it changes. */
export function AnimatedCount({ value, className }) {
  return (
    <span className={cn('relative inline-flex overflow-hidden tabular-nums', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function MenuToggle({ open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="group flex h-11 items-center gap-3 pr-2"
    >
      <span className="relative flex h-3 w-6 flex-col justify-between" aria-hidden="true">
        <span className="h-[1.5px] w-full bg-current transition-transform duration-500 group-hover:scale-x-75 origin-left" />
        <span className="h-[1.5px] w-2/3 bg-current transition-transform duration-500 group-hover:scale-x-150 origin-left" />
      </span>
      <span className="roll hidden text-[11px] font-semibold tracking-[0.2em] uppercase sm:inline-flex">
        <span>Menu</span>
        <span aria-hidden="true">Menu</span>
      </span>
    </button>
  )
}

export default function Navbar() {
  const { count: cartCount } = useCart()
  const { count: wishCount } = useWishlist()
  const ui = useUI()
  const location = useLocation()
  const currentUrl = location.pathname + location.search
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)

  // Hide on scroll down, reveal on scroll up — the bag is always one flick away.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      setHidden(y > 240 && y > lastY.current + 2 ? true : y < lastY.current - 2 ? false : (h) => h)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (to) => {
    const [path, query] = to.split('?')
    if (query) return currentUrl === to
    return location.pathname === path && !location.search
  }

  const textLink = 'roll text-[11px] font-semibold tracking-[0.2em] uppercase'
  const anyOverlay = ui.menuOpen || ui.searchOpen || ui.cartOpen

  return (
    <>
      <motion.header
        className={cn(
          'sticky top-0 z-40 bg-ink text-white transition-[border-color] duration-300',
          'border-b',
          scrolled ? 'border-white/10' : 'border-transparent',
        )}
        animate={{ y: hidden && !anyOverlay ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        <div className="container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-[76px]">
          <div className="flex items-center gap-6 xl:gap-9">
            <MenuToggle open={ui.menuOpen} onClick={ui.menuOpen ? ui.closeMenu : ui.openMenu} />
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-6 xl:gap-8">
                {PRIMARY.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={cn(
                        'link-underline block',
                        isActive(link.to) ? 'is-active text-blue' : 'text-white/85 hover:text-white',
                      )}
                      aria-current={isActive(link.to) ? 'page' : undefined}
                    >
                      <span className={textLink}>
                        <span>{link.label}</span>
                        <span aria-hidden="true">{link.label}</span>
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Logo className="h-12 lg:h-[60px]" />

          <div className="flex items-center justify-end gap-1 sm:gap-4 xl:gap-7">
            <button
              type="button"
              onClick={ui.openSearch}
              className="group flex h-11 items-center gap-2 px-2 text-white/85 transition-colors hover:text-white"
              aria-label="Search products"
            >
              <Search className="size-[18px]" />
              <span className={cn(textLink, 'hidden xl:inline-flex')}>
                <span>Search</span>
                <span aria-hidden="true">Search</span>
              </span>
            </button>
            <NavLink
              to="/wishlist"
              className="relative hidden h-11 items-center gap-1.5 px-2 text-white/85 transition-colors hover:text-white sm:flex"
              aria-label={`Wishlist, ${wishCount} items`}
            >
              <Heart className={cn('size-[18px]', wishCount > 0 && 'fill-blue text-blue')} />
              {wishCount > 0 && <AnimatedCount value={wishCount} className="text-[11px] font-semibold" />}
            </NavLink>
            <button
              type="button"
              onClick={ui.openCart}
              className="group flex h-11 items-center gap-2 pl-2 text-[11px] font-semibold tracking-[0.2em] uppercase"
              aria-label={`Open bag, ${cartCount} items`}
            >
              <span className="hidden sm:inline">Bag</span>
              <span
                className={cn(
                  'flex h-7 min-w-7 items-center justify-center px-1.5 text-[11px] tracking-normal transition-colors',
                  cartCount > 0 ? 'bg-blue text-white' : 'border border-white/30 text-white/80 group-hover:border-white',
                )}
              >
                <AnimatedCount value={cartCount} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <FullMenu open={ui.menuOpen} onClose={ui.closeMenu} isActive={isActive} />
      <SearchOverlay open={ui.searchOpen} onClose={ui.closeSearch} />
    </>
  )
}
