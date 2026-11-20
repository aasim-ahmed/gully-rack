import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SmartImage from '../common/SmartImage'
import SplitText from '../motion/SplitText'
import Reveal from '../motion/Reveal'
import Magnetic from '../motion/Magnetic'
import { EDITORIAL_IMAGE } from '../../data/site'

/** Section 05 — full-bleed campaign: "Good fits. Better finds." */
export default function Campaign() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-12%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 0.5], reduce ? [1, 1] : [1.25, 1.05])

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[90svh] overflow-hidden bg-ink text-white lg:min-h-[110vh]"
      aria-labelledby="campaign-title"
    >
      <motion.div className="absolute -inset-y-[14%] inset-x-0 -z-10" style={{ y, scale }}>
        <SmartImage
          src={EDITORIAL_IMAGE}
          alt="Bold red tee and statement sunglasses, styled for the street"
          width={1920}
          sizes="100vw"
          className="h-full bg-graphite!"
          imgClassName="object-[50%_30%]"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-ink/50" aria-hidden="true" />

      <div className="container-x flex flex-col justify-between py-10 sm:py-14">
        <div className="flex items-start justify-between gap-6">
          <p className="label text-white/70">(04) — Campaign</p>
          <p className="label text-right text-white/70">
            Look 04
            <span className="block text-white">Graded · Pre-Loved</span>
          </p>
        </div>

        <div className="py-16">
          <SplitText
            id="campaign-title"
            className="text-display font-extrabold tracking-tightest uppercase"
            stagger={0.09}
            duration={1.1}
            lines={[
              { text: 'Good fits.' },
              { text: 'Better finds.', className: 'text-right', lastClassName: 'accent text-blue' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 items-end gap-8 sm:grid-cols-2">
          <Reveal>
            <p className="max-w-sm text-sm leading-relaxed text-white/80">
              The best piece in the room is usually the one nobody else can buy. Every pre-loved find is checked
              seam by seam and graded before it lands here.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="sm:justify-self-end">
            <Magnetic>
              <Link
                to="/shop?condition=Pre-Loved"
                data-cursor="Shop"
                className="group flex items-center gap-5 border-b border-white pb-3 text-[11px] font-semibold tracking-[0.22em] uppercase"
              >
                <span className="roll">
                  <span>Shop pre-loved</span>
                  <span aria-hidden="true">Shop pre-loved</span>
                </span>
                <ArrowRight className="size-5 transition-transform duration-500 group-hover:translate-x-2" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
