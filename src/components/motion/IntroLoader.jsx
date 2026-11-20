import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE_IN_OUT, EASE_OUT } from './easing'

const KEY = 'gr:intro-seen'
const WORDS = ['Curated', 'Pre-loved', 'Graded', 'Yours']

/**
 * First-visit loading curtain (once per browser session, ~1.6 s, skipped for reduced motion).
 * A counter and rotating words play, then the black curtain lifts off the page.
 * Clicking or pressing any key skips it immediately.
 */
export default function IntroLoader() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem(KEY)
    } catch {
      return false
    }
  })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!show || reduce) return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* private mode — the intro simply replays */
    }
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1300)
      setCount(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setShow(false), 250)
    }
    raf = requestAnimationFrame(tick)
    const skip = () => setShow(false)
    window.addEventListener('keydown', skip)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', skip)
    }
  }, [show, reduce])

  const word = WORDS[Math.min(WORDS.length - 1, Math.floor((count / 100) * WORDS.length))]

  return (
    <AnimatePresence>
      {show && !reduce && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink p-5 text-white sm:p-10"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.9, ease: EASE_IN_OUT }}
          onClick={() => setShow(false)}
          role="status"
          aria-label="Loading GULLY RACK"
        >
          <div className="flex items-start justify-between">
            <p className="eyebrow text-white/50">Gully Rack</p>
            <p className="eyebrow text-white/50">Curated Streetwear &amp; Essentials</p>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={word}
                  className="accent text-5xl text-white sm:text-7xl"
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  {word}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="text-[22vw] leading-[0.8] font-extrabold tracking-tightest tabular-nums sm:text-[14vw]">
              {count}
              <span className="text-blue">%</span>
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <div className="h-full origin-left bg-blue" style={{ transform: `scaleX(${count / 100})` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
