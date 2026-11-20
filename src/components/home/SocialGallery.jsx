import { ArrowUpRight } from 'lucide-react'
import SmartImage from '../common/SmartImage'
import { InstagramIcon } from '../common/SocialIcons'
import ImageReveal from '../motion/ImageReveal'
import SplitText from '../motion/SplitText'
import Reveal from '../motion/Reveal'
import Magnetic from '../motion/Magnetic'
import { INSTAGRAM_POSTS, SITE } from '../../data/site'
import { cn } from '../../utils/format'

// Asymmetric placement per post (desktop) — offsets make the wall feel pinned up by hand.
const PLACEMENT = [
  'lg:col-span-4 aspect-[4/5]',
  'lg:col-span-3 lg:mt-28 aspect-square',
  'lg:col-span-5 aspect-[4/3] lg:mt-10',
  'lg:col-span-3 lg:col-start-2 aspect-square lg:-mt-10',
  'lg:col-span-4 aspect-[4/5] lg:-mt-24',
  'lg:col-span-3 aspect-[3/4] lg:mt-6',
]

/** Section 08 — Instagram-style gallery. */
export default function SocialGallery() {
  return (
    <section className="overflow-hidden bg-white py-20 sm:py-28 lg:py-36" aria-labelledby="social-title">
      <div className="container-x">
        <div className="mb-12 flex flex-col gap-8 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label mb-6 text-ink/50">(07) — Worn by the gully</p>
            <SplitText
              id="social-title"
              className="heading-xl"
              lines={['Seen on', { text: '@gullyrack', className: 'accent normal-case text-blue' }]}
            />
          </div>
          <Reveal className="flex flex-col items-start gap-6 lg:items-end">
            <p className="max-w-xs text-sm leading-relaxed text-ink/60 lg:text-right">
              Tag your fit with <strong className="text-ink">#GullyRack</strong> for a chance to be on the wall.
            </p>
          </Reveal>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-12 lg:gap-6">
          {INSTAGRAM_POSTS.map((post, i) => (
            <li key={post.id} className={cn(PLACEMENT[i], i % 2 === 1 && 'max-lg:translate-y-10')}>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block h-full"
                aria-label={`${post.alt} — view on Instagram`}
                data-cursor="Open"
              >
                <ImageReveal className="h-full bg-mist" delay={(i % 3) * 0.1}>
                  <SmartImage
                    src={post.image}
                    alt={post.alt}
                    width={700}
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="h-full"
                    imgClassName="transition-[transform,filter] duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07] group-hover:grayscale"
                  />
                </ImageReveal>
                <span className="absolute inset-0 flex items-end justify-between bg-blue/0 p-3 text-white opacity-0 transition-all duration-500 group-hover:bg-blue/40 group-hover:opacity-100 sm:p-4">
                  <span className="label">@{SITE.instagram}</span>
                  <InstagramIcon />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-24 flex justify-center lg:mt-20">
          <Magnetic>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex size-40 flex-col items-center justify-center gap-2 rounded-full bg-ink text-center text-[11px] font-semibold tracking-[0.2em] text-white uppercase transition-colors duration-500 hover:bg-blue sm:size-48"
            >
              <InstagramIcon />
              Follow
              <span className="flex items-center gap-1">
                the rack <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
