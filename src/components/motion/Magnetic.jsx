import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { cn } from '../../utils/format'

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 }
const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

/**
 * Magnetic hover: the wrapped element leans toward the cursor and springs back on leave.
 * Desktop (fine pointer) only; disabled for reduced motion. `strength` is 0–1.
 */
export default function Magnetic({ strength = 0.35, className, children }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, SPRING)
  const sy = useSpring(y, SPRING)

  const onMove = (e) => {
    if (reduce || !finePointer() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}
