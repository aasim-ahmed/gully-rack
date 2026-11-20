import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SplitText from '../motion/SplitText'
import Reveal from '../motion/Reveal'
import ImageReveal from '../motion/ImageReveal'
import SmartImage from '../common/SmartImage'
import { ABOUT_IMAGE } from '../../data/site'

const RULES = [
  {
    tag: 'Individuality',
    title: 'Nobody in your class owns this jacket.',
    text: 'Most pre-loved pieces here are one-of-one. When it’s gone it’s gone, and so is any chance of turning up in the same fit as someone else.',
  },
  {
    tag: 'Affordable',
    title: 'Streetwear without the resale tax.',
    text: 'Priced for students and first salaries, not hype markups. Good clothes shouldn’t need a waiting list or a credit card limit.',
  },
  {
    tag: 'Curated',
    title: 'Picked, not dumped.',
    text: 'Every piece is chosen by hand, cleaned and graded Excellent, Very Good or Good. Flaws get written down, never hidden.',
  },
  {
    tag: 'Reuse',
    title: 'The greenest jacket is the one already made.',
    text: 'Buying pre-loved keeps good clothes in rotation and out of landfill. Same drip, lighter footprint.',
  },
]

/** Section 07 — brand culture. A sticky manifesto column with the four rules scrolling past it. */
export default function BrandCulture() {
  return (
    <section className="bg-blue text-white" aria-labelledby="culture-title">
      <div className="container-x grid grid-cols-1 gap-14 py-20 sm:py-28 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="label mb-6 text-white/70">(06) — Rack rules</p>
            <SplitText
              id="culture-title"
              className="heading-xl"
              lines={['Dress like', 'nobody', { text: 'else can.', className: 'accent normal-case text-ink' }]}
            />
            <ImageReveal className="mt-10 hidden aspect-[4/3] w-4/5 lg:block" parallax={20}>
              <SmartImage
                src={ABOUT_IMAGE}
                alt="Inside the GULLY RACK studio, sorting pre-loved stock"
                width={800}
                sizes="35vw"
                className="h-full bg-ink!"
              />
            </ImageReveal>
          </div>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {RULES.map((rule, i) => (
            <Reveal as="li" key={rule.tag} className="group border-t border-white/30 py-10 first:border-t-0 first:pt-0 sm:py-14">
              <div className="flex items-baseline justify-between gap-6">
                <span className="text-6xl leading-none font-extrabold tracking-tightest text-ink tabular-nums sm:text-8xl">
                  0{i + 1}
                </span>
                <span className="label text-white/80">[ {rule.tag} ]</span>
              </div>
              <h3 className="mt-6 text-3xl leading-[0.95] font-extrabold tracking-tighter uppercase sm:text-5xl">
                {rule.title}
              </h3>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">{rule.text}</p>
            </Reveal>
          ))}
          <Reveal as="li" className="pt-4">
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 border-b border-white pb-2 text-[11px] font-semibold tracking-[0.22em] uppercase"
            >
              How we grade &amp; source
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          </Reveal>
        </ol>
      </div>
    </section>
  )
}
