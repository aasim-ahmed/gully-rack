import { motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASE_OUT, VIEWPORT } from './easing'

/**
 * Fades and lifts its children into place when they scroll into view.
 * `as` picks the element (any motion.* tag); `y` is the travel distance in px.
 */
export default function Reveal({ as = 'div', delay = 0, y = 32, duration = DURATION.base, className, children, ...props }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE_OUT }}
      {...props}
    >
      {children}
    </Tag>
  )
}

/** Staggers direct <RevealItem> children. */
export function RevealGroup({ as = 'div', stagger = 0.08, delay = 0, className, children, ...props }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function RevealItem({ as = 'div', y = 28, className, children, ...props }) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
      }}
      {...props}
    >
      {children}
    </Tag>
  )
}
