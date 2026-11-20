import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ANNOUNCEMENTS } from '../../data/site'

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = ANNOUNCEMENTS.length

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 4500)
    return () => clearInterval(t)
  }, [paused, total])

  const go = (dir) => setIndex((i) => (i + dir + total) % total)
  const item = ANNOUNCEMENTS[index]

  return (
    <div
      className="bg-blue text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-x flex h-9 items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          className="p-1 text-white/70 transition-colors hover:text-white"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <div className="relative flex h-full min-w-0 flex-1 items-center justify-center overflow-hidden" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-full truncate"
            >
              <Link
                to={item.to}
                className="text-[10px] font-semibold tracking-[0.16em] whitespace-nowrap uppercase sm:tracking-[0.2em] transition-opacity hover:opacity-80 sm:text-[11px]"
              >
                {item.text}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          className="p-1 text-white/70 transition-colors hover:text-white"
          aria-label="Next announcement"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
