import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE_IN_OUT, VIEWPORT } from './easing'
import { cn } from '../../utils/format'

const FROM = {
  up: 'inset(100% 0% 0% 0%)',
  down: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
}

/**
 * Image reveal mask: the frame wipes open (clip-path) while the picture inside settles
 * from a slight zoom. Optional `parallax` adds scroll-linked drift to the inner layer,
 * so give the child some overscan (it is scaled 1.15 when parallax is on).
 */
export default function ImageReveal({
  direction = 'up',
  delay = 0,
  parallax = 0,
  className,
  innerClassName,
  children,
  ...props
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce || !parallax ? [0, 0] : [-parallax, parallax])

  return (
    <motion.div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      initial={reduce ? false : { clipPath: FROM[direction] }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={VIEWPORT}
      transition={{ duration: 1.2, delay, ease: EASE_IN_OUT }}
      {...props}
    >
      <motion.div
        className={cn('h-full w-full', innerClassName)}
        style={{ y, scale: parallax ? 1.15 : undefined }}
      >
        <motion.div
          className="h-full w-full"
          initial={reduce ? false : { scale: 1.25 }}
          whileInView={{ scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.6, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
