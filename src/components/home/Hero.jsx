import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowRight } from 'lucide-react'
import SmartImage from '../common/SmartImage'
import SplitText from '../motion/SplitText'
import Magnetic from '../motion/Magnetic'
import { EASE_OUT } from '../motion/easing'
import { HERO_IMAGE } from '../../data/site'

/** On a first visit the intro curtain plays for ~1.6 s, so the hero waits for it. */
function useIntroDelay() {
  const [delay] = useState(() => {
    try {
      return sessionStorage.getItem('gr:intro-seen') ? 0 : 1.6
    } catch {
      return 0
    }
  })
  return delay
}

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const d = useIntroDelay()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '22%'])
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-18%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const appear = (delay, y = 16) => ({
    initial: reduce ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: d + delay, ease: EASE_OUT },
  })

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-ink text-white"
      aria-labelledby="hero-title"
    >
      <motion.div className="absolute inset-0 -z-10" style={{ y: imageY }}>
        <motion.div
          className="h-full w-full"
          initial={reduce ? false : { scale: 1.18 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, delay: d, ease: EASE_OUT }}
        >
          <SmartImage
            src={HERO_IMAGE}
            alt="Model in a black leather jacket and denim sitting against a brick wall"
            width={1920}
            sizes="100vw"
            priority
            className="h-full bg-graphite!"
            imgClassName="object-[62%_30%] lg:object-[center_28%]"
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-ink/45" aria-hidden="true" />

      <div className="container-x relative flex min-h-[calc(100svh-10.25rem)] flex-col pt-5 pb-6 sm:pt-8 lg:min-h-[calc(100svh-7rem)] lg:pb-10">
        {/* Campaign labels */}
        <motion.div {...appear(0.1, -10)} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <p className="label text-white/70">
            <span className="text-blue">●</span> Campaign N°01
            <span className="block text-white">The Gully Edit</span>
          </p>
          <p className="label hidden text-center text-white/70 sm:block">
            Pre-Loved + New
            <span className="block text-white">Graded honestly</span>
          </p>
          <p className="label text-right text-white/70">
            Drops every
            <span className="block text-white">Friday · India</span>
          </p>
        </motion.div>

        <motion.div style={{ y: textY, opacity: fade }} className="mt-auto pt-10 sm:pt-16">
          <SplitText
            as="h1"
            id="hero-title"
            trigger="mount"
            delay={d + 0.2}
            stagger={0.08}
            duration={1}
            className="text-[16.5vw] leading-[0.82] font-extrabold tracking-tightest uppercase sm:text-display"
            lines={[
              { text: 'Not made' },
              { text: 'to blend', className: 'text-outline-white sm:pl-[8vw]' },
              { text: 'in.', className: 'text-blue' },
            ]}
          />
        </motion.div>

        <div className="mt-8 grid grid-cols-1 items-end gap-8 sm:mt-10 lg:grid-cols-12">
          <motion.p {...appear(0.9)} className="max-w-sm text-sm leading-relaxed text-white/75 lg:col-span-4">
            Hand-picked pre-loved pieces and new essentials, each one checked and graded.{' '}
            <span className="accent text-lg text-white">One-of-ones don’t wait.</span>
          </motion.p>

          <motion.div {...appear(1.05)} className="flex flex-wrap items-center gap-4 lg:col-span-5 lg:justify-center">
            <Magnetic strength={0.3}>
              <Link
                to="/shop"
                data-cursor="Shop"
                className="group relative isolate flex h-16 items-center gap-6 overflow-hidden bg-blue pr-3 pl-7 text-[11px] font-semibold tracking-[0.22em] uppercase sm:h-20 sm:pl-9 sm:text-xs"
              >
                <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-white transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                <span className="roll transition-colors duration-500 group-hover:text-ink">
                  <span>Shop the collection</span>
                  <span aria-hidden="true">Shop the collection</span>
                </span>
                <span className="flex size-10 items-center justify-center bg-ink text-white sm:size-14">
                  <ArrowRight className="size-4 transition-transform duration-500 group-hover:-rotate-45 sm:size-5" />
                </span>
              </Link>
            </Magnetic>
            <Link
              to="/shop?collection=new"
              className="link-underline text-[11px] font-semibold tracking-[0.22em] uppercase"
            >
              New in
            </Link>
          </motion.div>

          <motion.a
            {...appear(1.2)}
            href="#statement"
            className="hidden items-center justify-end gap-4 lg:col-span-3 lg:flex"
            aria-label="Scroll to content"
          >
            <span className="label text-white/70">Scroll</span>
            <span className="relative h-14 w-px overflow-hidden bg-white/20" aria-hidden="true">
              <span className="absolute inset-0 animate-scroll-cue bg-white" />
            </span>
            <ArrowDownRight className="size-4 text-white/70" />
          </motion.a>
        </div>
      </div>
    </section>
  )
}
