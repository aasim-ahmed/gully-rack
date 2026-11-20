import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * Scroll-linked vertical drift. Returns a motion value that moves from +distance
 * to -distance while `ref` travels through the viewport. Native scrolling is untouched.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useParallax(ref, distance = 60) {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  return useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [distance, -distance])
}

export default function Parallax({ distance = 60, className, innerClassName, children }) {
  const ref = useRef(null)
  const y = useParallax(ref, distance)
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className={innerClassName}>
        {children}
      </motion.div>
    </div>
  )
}
