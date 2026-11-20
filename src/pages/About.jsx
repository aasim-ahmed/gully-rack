import { ArrowUpRight } from 'lucide-react'
import Seo from '../components/common/Seo'
import SmartImage from '../components/common/SmartImage'
import { ButtonLink } from '../components/common/Button'
import SplitText from '../components/motion/SplitText'
import ImageReveal from '../components/motion/ImageReveal'
import Reveal, { RevealGroup, RevealItem } from '../components/motion/Reveal'
import { ABOUT_IMAGE, ABOUT_IMAGE_ALT, SITE, WHY_SHOP } from '../data/site'

const STEPS = [
  { title: 'Source', text: 'We dig through bales, closets and wholesale lots to find pieces worth a second life.' },
  { title: 'Inspect', text: 'Every seam, zip, button and print is checked. Anything that does not pass stays off the rack.' },
  { title: 'Clean & Grade', text: 'Items are cleaned, measured flat and given an honest grade: Excellent, Very Good or Good.' },
  { title: 'Drop', text: 'New pieces go live every Friday, photographed as they are — flaws noted, never hidden.' },
]

export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        description="GULLY RACK is a curated thrift and streetwear store built for Gen Z — hand-picked pre-loved finds and new essentials, honestly graded and fairly priced."
      />

      <section className="overflow-hidden bg-ink text-white">
        <div className="container-x pt-10 pb-16 sm:pt-16 sm:pb-24">
          <p className="label mb-8 text-white/50">About — Gully Rack</p>
          <SplitText
            as="h1"
            trigger="mount"
            className="text-display font-extrabold tracking-tightest uppercase"
            lines={[
              { text: 'Born in' },
              { text: 'the gully.', lastClassName: 'text-blue' },
              { text: 'Built for the streets.', className: 'accent normal-case text-[0.42em] leading-tight text-white/80 pt-4' },
            ]}
          />
          <Reveal delay={0.4} className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <p className="max-w-xl text-lg leading-relaxed text-white/75 lg:col-span-6 lg:col-start-7">
              GULLY RACK started with a simple frustration: great streetwear was either overpriced or buried under
              piles of junk. So we built the rack we wanted to shop from.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-2 bg-ink pb-2 sm:grid-cols-5">
        <ImageReveal className="aspect-[16/10] sm:col-span-3" parallax={30}>
          <SmartImage
            src={ABOUT_IMAGE}
            alt="Racks of curated clothing in a thrift store"
            width={1400}
            sizes="(min-width: 640px) 60vw, 100vw"
            className="h-full bg-graphite!"
          />
        </ImageReveal>
        <ImageReveal className="aspect-[4/3] sm:col-span-2 sm:aspect-auto" direction="down" delay={0.15}>
          <SmartImage
            src={ABOUT_IMAGE_ALT}
            alt="Shirts hanging on a clothing rail"
            width={900}
            sizes="(min-width: 640px) 40vw, 100vw"
            className="h-full bg-graphite!"
          />
        </ImageReveal>
      </div>

      <section className="container-x grid grid-cols-1 gap-10 py-20 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label mb-6 text-ink/50">(01) — Our story</p>
          <SplitText className="heading-xl" lines={['Thrift with', { text: 'taste.', className: 'accent normal-case text-blue' }]} />
        </div>
        <Reveal className="space-y-6 text-base leading-relaxed text-ink/70 sm:text-lg lg:col-span-6 lg:col-start-7">
          <p>
            We are a small team of thrifters, sneakerheads and late-night scrollers who grew up dressing from
            local markets, older siblings’ wardrobes and whatever we could afford. That mix of hustle and style is
            what the gully means to us.
          </p>
          <p>
            Today, GULLY RACK curates pre-loved streetwear and a tight line of new essentials — heavyweight
            tees, hoodies and cargos — for students, creatives and anyone who wants to look good without paying
            hype prices.
          </p>
          <p className="text-ink">
            Our one rule: <strong>honesty first.</strong> Pre-loved is always labelled pre-loved, every flaw is
            noted, and every measurement is real.
          </p>
        </Reveal>
      </section>

      <section className="bg-blue py-20 text-white sm:py-28">
        <div className="container-x">
          <p className="label mb-6 text-white/70">(02) — How a piece reaches the rack</p>
          <SplitText className="heading-xl" lines={['The process.']} />
          <RevealGroup as="ol" className="mt-14 grid grid-cols-1 border-t border-white/30 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <RevealItem
                as="li"
                key={s.title}
                className="border-b border-white/30 py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
              >
                <span className="text-7xl leading-none font-extrabold tracking-tightest text-ink">0{i + 1}</span>
                <h3 className="mt-8 text-xl font-extrabold tracking-tight uppercase">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{s.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="container-x py-20 sm:py-28">
        <p className="label mb-6 text-ink/50">(03) — What you can count on</p>
        <RevealGroup as="ul" className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {WHY_SHOP.map((item) => (
            <RevealItem as="li" key={item.title} className="border-t border-ink/15 py-8">
              <h3 className="text-2xl font-extrabold tracking-tighter uppercase sm:text-3xl">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/65">{item.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="bg-mist">
        <div className="container-x flex flex-col items-start gap-8 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-full">
            <p className="label mb-4 text-ink/50">Join the community</p>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex max-w-full items-center gap-3 text-[11vw] font-extrabold tracking-tightest uppercase sm:gap-4 sm:text-7xl"
            >
              <span className="transition-colors group-hover:text-blue">@{SITE.instagram}</span>
              <ArrowUpRight className="size-8 shrink-0 text-blue sm:size-10 transition-transform duration-500 group-hover:rotate-45" />
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/shop" size="lg">
              Shop the rack
            </ButtonLink>
            <ButtonLink to="/contact" variant="outline" size="lg">
              Get in touch
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
