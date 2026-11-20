import { Fragment } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT, VIEWPORT } from './easing'
import { cn } from '../../utils/format'

/**
 * Split-text heading reveal. Each line is a mask; its words (or characters) rise
 * up from below the mask in sequence.
 *
 * lines: array of strings or { text, className, lastClassName } objects — one entry per visual line.
 *        lastClassName styles the final word only (e.g. a serif accent on "finds.").
 * trigger: 'view' (when scrolled into view) or 'mount' (immediately, e.g. hero).
 * Screen readers get the full sentence once via aria-label; the animated pieces are hidden.
 */
export default function SplitText({
  as: Tag = 'h2',
  lines,
  by = 'word',
  trigger = 'view',
  delay = 0,
  stagger = 0.06,
  duration = 0.9,
  className,
  lineClassName,
  id,
}) {
  const reduce = useReducedMotion()
  const normalised = lines.map((l) => (typeof l === 'string' ? { text: l } : l))
  const label = normalised.map((l) => l.text).join(' ')

  // Global order of every animated piece, so the stagger runs across lines.
  const starts = []
  normalised.reduce((n, l, li) => {
    starts[li] = n
    const words = l.text.split(' ')
    return n + (by === 'char' ? words.join('').length : words.length)
  }, 0)

  const piece = (content, key, i, extra) => {
    return (
      <motion.span
        key={key}
        className={cn('inline-block will-change-transform', extra)}
        variants={{
          hidden: { y: '108%', rotate: by === 'char' ? 0 : 4 },
          show: { y: '0%', rotate: 0, transition: { duration, ease: EASE_OUT, delay: delay + i * stagger } },
        }}
      >
        {content}
      </motion.span>
    )
  }

  const animateProps =
    trigger === 'mount'
      ? { initial: reduce ? false : 'hidden', animate: 'show' }
      : { initial: reduce ? false : 'hidden', whileInView: 'show', viewport: VIEWPORT }

  return (
    <Tag id={id} className={className} aria-label={label}>
      <motion.span className="block" aria-hidden="true" {...animateProps}>
        {normalised.map((line, li) => {
          const words = line.text.split(' ')
          return (
            <span
              key={li}
              className={cn('block overflow-hidden pb-[0.06em] -mb-[0.06em]', lineClassName, line.className)}
            >
              {words.map((word, wi) => (
                <Fragment key={wi}>
                  {by === 'char' ? (
                    <span className={cn('inline-block whitespace-nowrap', wi === words.length - 1 && line.lastClassName)}>
                      {[...word].map((ch, ci) =>
                        piece(ch, ci, starts[li] + words.slice(0, wi).join('').length + ci),
                      )}
                    </span>
                  ) : (
                    piece(word, wi, starts[li] + wi, wi === words.length - 1 ? line.lastClassName : undefined)
                  )}
                  {wi < words.length - 1 && ' '}
                </Fragment>
              ))}
            </span>
          )
        })}
      </motion.span>
    </Tag>
  )
}
