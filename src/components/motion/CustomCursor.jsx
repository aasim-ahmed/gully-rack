import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

/**
 * Desktop cursor follower. The native cursor stays (usability first); a ring trails it,
 * tightens over links and buttons, and expands into a label over anything marked
 * with data-cursor="View" / "Drag" / … . Rendered with mix-blend-difference so it reads
 * on black and white sections alike. Not rendered on touch or reduced-motion devices.
 */
export default function CustomCursor() {
  const reduce = useReducedMotion()
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine) and (hover: hover)').matches,
  )
  const [visible, setVisible] = useState(false)
  const [state, setState] = useState({ hover: false, label: '' })

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })

  useEffect(() => {
    if (!enabled || reduce) return
    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = e.target instanceof Element ? e.target : null
      const labelled = target?.closest('[data-cursor]')
      const interactive = target?.closest('a, button, [role="button"], label, select, summary')
      const next = { hover: !!interactive || !!labelled, label: labelled?.getAttribute('data-cursor') || '' }
      setState((prev) => (prev.hover === next.hover && prev.label === next.label ? prev : next))
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, reduce, x, y])

  if (!enabled || reduce) return null

  const size = state.label ? 88 : state.hover ? 44 : 22

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border border-white text-white"
        style={{ translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: state.label ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      >
        <AnimatePresence>
          {state.label && (
            <motion.span
              key={state.label}
              className="text-[10px] font-semibold tracking-[0.2em] text-ink uppercase"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
