import { Suspense, useEffect } from 'react'
import { useLocation, useNavigate, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileDock from './MobileDock'
import CartDrawer from '../cart/CartDrawer'
import PageLoader from '../common/PageLoader'
import CustomCursor from '../motion/CustomCursor'
import ScrollProgress from '../motion/ScrollProgress'
import IntroLoader from '../motion/IntroLoader'
import { EASE_IN_OUT } from '../motion/easing'

/**
 * Page transition: a black curtain rises over the outgoing page, the scroll position resets
 * behind it, and it lifts off the incoming page. Only pathname changes trigger it —
 * filter and sort changes on /shop stay instant.
 */
function Curtain() {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[65] flex items-end bg-ink"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.55, ease: EASE_IN_OUT, delay: 0.05 } }}
      exit={{ clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'], transition: { duration: 0.3, ease: EASE_IN_OUT } }}
    >
      <span className="h-1 w-full bg-blue" />
    </motion.div>
  )
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  // useOutlet (rather than <Outlet/>) freezes the outgoing page while it animates out.
  const outlet = useOutlet()

  // Toast actions (outside the router tree) navigate by dispatching this event.
  useEffect(() => {
    const onNavigate = (e) => navigate(e.detail)
    window.addEventListener('gr:navigate', onNavigate)
    return () => window.removeEventListener('gr:navigate', onNavigate)
  }, [navigate])

  return (
    <div className="pb-dock flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-[80] bg-blue px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <IntroLoader />
      <ScrollProgress />
      <AnnouncementBar />
      <Navbar />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
      >
        <motion.main id="main" key={location.pathname} className="flex-1" exit={{ opacity: 1 }}>
          <Curtain />
          <Suspense fallback={<PageLoader />}>{outlet}</Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <MobileDock />
      <CartDrawer />
      <CustomCursor />
    </div>
  )
}
