import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react'
import Logo from '../common/Logo'
import { InstagramIcon } from '../common/SocialIcons'
import Magnetic from '../motion/Magnetic'
import SplitText from '../motion/SplitText'
import NewsletterForm from './NewsletterForm'
import { FOOTER_LINKS, SITE } from '../../data/site'
import { EASE_OUT } from '../motion/easing'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const reduce = useReducedMotion()
  const toTop = () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* Newsletter */}
      <div className="container-x grid grid-cols-1 gap-10 border-b border-white/10 py-16 sm:py-20 lg:grid-cols-12 lg:items-end lg:py-28">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-5 text-blue">[ The Drop List ]</p>
          <SplitText
            as="h2"
            className="heading-xl"
            lines={['First dibs', { text: 'on every drop.', className: 'accent normal-case text-white/90' }]}
          />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="mb-8 max-w-md text-sm leading-relaxed text-white/60">
            One-of-ones go in hours. Get Friday drops before they’re public, plus restock alerts on essentials.
            One email a week, nothing else.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Navigation */}
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 py-14 sm:grid-cols-4 lg:grid-cols-12 lg:py-20">
        <div className="col-span-2 sm:col-span-4 lg:col-span-4">
          <Logo className="h-20 -ml-2 sm:h-24" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
            {SITE.tagline}. Pre-loved finds and new essentials for people who dress like they mean it.
          </p>
        </div>
        {FOOTER_LINKS.map((group) => (
          <nav key={group.title} aria-label={group.title} className="lg:col-span-2">
            <p className="eyebrow mb-5 text-white/35">{group.title}</p>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="link-underline text-sm text-white/75 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="lg:col-span-2">
          <p className="eyebrow mb-5 text-white/35">Follow</p>
          <ul className="space-y-3 text-sm text-white/75">
            <li>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <InstagramIcon /> <span className="link-underline">Instagram</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail className="size-[18px]" /> <span className="link-underline">{SITE.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Oversized handle */}
      <a
        href={SITE.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="Follow"
        className="group container-sm flex items-end justify-between gap-4 overflow-hidden border-t border-white/10 pt-6"
        aria-label={`Follow  on Instagram`}
      >
      </a>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-6 text-[11px] tracking-wide text-white/45">
          <p>© {YEAR} GULLY RACK. All rights reserved.</p>
          <p className="hidden sm:block">Not made to blend in · gullyrack.in</p>
          <Magnetic strength={0.4}>
            <button
              type="button"
              onClick={toTop}
              className="group flex items-center gap-3 font-semibold tracking-[0.2em] text-white uppercase"
            >
              Back to top
              <span className="flex size-10 items-center justify-center border border-white/30 transition-colors group-hover:border-blue group-hover:bg-blue">
                <ArrowUp className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5" />
              </span>
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  )
}
