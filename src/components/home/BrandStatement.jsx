import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import SplitText from '../motion/SplitText'
import ImageReveal from '../motion/ImageReveal'
import Reveal from '../motion/Reveal'
import SmartImage from '../common/SmartImage'
import { ABOUT_IMAGE_ALT, EDITORIAL_IMAGE_ALT } from '../../data/site'

/** Section 02 — "Your style. Your rules. Your rack." Lines drift in from opposite sides as you scroll. */
export default function BrandStatement() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const range = (from) => (reduce ? ['0vw', '0vw'] : [`${from}vw`, '0vw'])
  const x1 = useTransform(scrollYProgress, [0, 1], range(-12))
  const x2 = useTransform(scrollYProgress, [0, 1], range(14))
  const x3 = useTransform(scrollYProgress, [0, 1], range(-8))

  return (
    <section id="statement" ref={ref} className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-40" aria-label="Brand statement">
      <div className="container-x">
        <div className="mb-12 flex items-center justify-between gap-6 border-b border-ink/10 pb-4 lg:mb-20">
          <p className="label text-ink/50">(01) — Manifesto</p>
          <p className="label text-ink/50">Gully Rack ©</p>
        </div>

        <div className="relative text-[12.5vw] leading-[0.84] font-extrabold tracking-tightest uppercase lg:text-[10.5vw]">
          <motion.div style={{ x: x1 }}>
            <SplitText as="p" lines={['Your style.']} stagger={0.05} />
          </motion.div>
          <motion.div style={{ x: x2 }} className="flex items-center justify-end gap-[3vw]">
            <ImageReveal direction="left" className="hidden aspect-[4/3] w-[14vw] shrink-0 lg:block" delay={0.2}>
              <SmartImage src={EDITORIAL_IMAGE_ALT} alt="" width={600} sizes="18vw" className="h-full" />
            </ImageReveal>
            <SplitText as="p" lines={[{ text: 'Your rules.', className: 'text-outline' }]} stagger={0.05} delay={0.1} />
          </motion.div>
          <motion.div style={{ x: x3 }}>
            <SplitText
              as="p"
              lines={[{ text: 'Your rack.', lastClassName: 'text-blue' }]}
              stagger={0.05}
              delay={0.2}
            />
          </motion.div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-12">
          <ImageReveal className="aspect-[4/5] w-2/3 sm:w-1/2 lg:col-span-3 lg:w-full" parallax={30}>
            <SmartImage
              src={ABOUT_IMAGE_ALT}
              alt="Rails of pre-loved clothing being sorted"
              width={700}
              sizes="(min-width: 1024px) 25vw, 60vw"
              className="h-full"
            />
          </ImageReveal>
          <div className="flex flex-col justify-end lg:col-span-6 lg:col-start-6">
            <Reveal>
              <p className="text-2xl leading-[1.2] font-medium tracking-tight sm:text-3xl lg:text-[2.6rem]">
                No dress code. No trend cycle. Just pieces with history and basics that hold up,{' '}
                <span className="accent text-blue">picked one by one</span> and graded honestly.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
              <Link to="/about" className="link-underline text-[11px] font-semibold tracking-[0.22em] uppercase">
                Our story
              </Link>
              <Link
                to="/shop?condition=Pre-Loved"
                className="link-underline text-[11px] font-semibold tracking-[0.22em] uppercase"
              >
                Shop pre-loved
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
