import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import Logo from '../common/Logo'
import SmartImage from '../common/SmartImage'
import { InstagramIcon } from '../common/SocialIcons'
import { SITE } from '../../data/site'
import { CATEGORIES } from '../../data/categories'
import { getAllProducts } from '../../data/products'
import { useEscapeKey, useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { EASE_IN_OUT, EASE_OUT } from '../motion/easing'
import { cn } from '../../utils/format'

const LINKS = [
  { label: 'Shop All', to: '/shop', image: CATEGORIES[0].image },
  { label: 'New In', to: '/shop?collection=new', image: CATEGORIES[4].image },
  { label: 'Pre-Loved', to: '/shop?condition=Pre-Loved', image: CATEGORIES[3].image },
  { label: 'Essentials', to: '/shop?condition=New', image: CATEGORIES[2].image },
  { label: 'About', to: '/about', image: CATEGORIES[1].image },
]

const COUNTS = getAllProducts().reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {})

/** Full-screen navigation for every screen size: oversized links + live image preview on desktop. */
export default function FullMenu({ open, onClose, isActive }) {
  useLockBodyScroll(open)
  useEscapeKey(open, onClose)
  const [preview, setPreview] = useState(LINKS[0].image)

  const item = (i) => ({
    initial: { y: '110%' },
    animate: { y: '0%', transition: { duration: 0.8, delay: 0.25 + i * 0.06, ease: EASE_OUT } },
    exit: { y: '110%', transition: { duration: 0.3, ease: EASE_IN_OUT } },
  })

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-white"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.6, delay: 0.15, ease: EASE_IN_OUT } }}
          transition={{ duration: 0.75, ease: EASE_IN_OUT }}
        >
          <div className="container-x grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center lg:h-[76px]">
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 items-center gap-3 justify-self-start text-[11px] font-semibold tracking-[0.2em] uppercase"
            >
              <X className="size-5" /> <span className="hidden sm:inline">Close</span>
            </button>
            <Logo className="h-12 lg:h-[60px]" onClick={onClose} />
            <p className="eyebrow hidden justify-self-end text-white/40 sm:block">Streetwear &amp; Essentials</p>
          </div>

          <div className="container-x grid flex-1 grid-cols-1 gap-10 py-8 lg:grid-cols-12 lg:py-12">
            <nav aria-label="Menu" className="lg:col-span-7">
              <ul>
                {LINKS.map((link, i) => {
                  const active = isActive(link.to)
                  return (
                    <li key={link.to} className="overflow-hidden border-b border-white/10">
                      <motion.div {...item(i)}>
                        <Link
                          to={link.to}
                          onMouseEnter={() => setPreview(link.image)}
                          onFocus={() => setPreview(link.image)}
                          className="group flex items-baseline gap-4 py-2 sm:gap-6 lg:py-3"
                        >
                          <span className="label w-8 text-white/40">0{i + 1}</span>
                          <span
                            className={cn(
                              'text-[11.5vw] leading-[0.95] font-extrabold tracking-tightest whitespace-nowrap uppercase transition-[color,transform] duration-500 group-hover:translate-x-3 sm:text-7xl lg:text-[6.2vw] xl:text-[5.6vw]',
                              active ? 'text-blue' : 'group-hover:text-blue',
                            )}
                          >
                            {link.label}
                          </span>
                          <ArrowUpRight className="ml-auto size-6 shrink-0 -translate-x-3 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 sm:size-8" />
                        </Link>
                      </motion.div>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="flex flex-col gap-10 lg:col-span-5">
              <motion.div
                className="relative hidden aspect-[4/3] overflow-hidden lg:block"
                initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
                animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1, delay: 0.35, ease: EASE_IN_OUT } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={preview}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                  >
                    <SmartImage src={preview} alt="" width={900} sizes="40vw" className="h-full bg-graphite!" />
                  </motion.div>
                </AnimatePresence>
                <p className="accent absolute bottom-4 left-5 text-3xl text-white">Not made to blend in.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.6, ease: EASE_OUT } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <p className="eyebrow mb-4 text-white/40">Categories</p>
                <ul className="grid grid-cols-2 gap-x-6">
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <Link
                        to={`/shop?category=${c.slug}`}
                        onMouseEnter={() => setPreview(c.image)}
                        className="group flex items-center justify-between border-b border-white/10 py-3 text-sm font-medium"
                      >
                        <span className="link-underline">{c.name}</span>
                        <span className="label text-white/40 group-hover:text-blue">{COUNTS[c.slug] || 0}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="container-x flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-5 text-[11px] font-semibold tracking-[0.18em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <div className="flex gap-6">
              <Link to="/wishlist" className="link-underline">Wishlist</Link>
              <Link to="/faqs" className="link-underline">FAQs</Link>
              <Link to="/contact" className="link-underline">Contact</Link>
            </div>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue"
            >
              <InstagramIcon /> @{SITE.instagram}
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
