import Breadcrumbs from './Breadcrumbs'
import SplitText from '../motion/SplitText'
import Reveal from '../motion/Reveal'

/** Editorial page masthead: black, oversized split-text title, optional serif accent line. */
export default function PageHeader({ eyebrow, title, accent, text, crumbs, children }) {
  return (
    <header className="overflow-hidden bg-ink text-white">
      <div className="container-x pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pb-20">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            {eyebrow && <p className="label mb-6 text-blue">[ {eyebrow} ]</p>}
            <SplitText
              as="h1"
              trigger="mount"
              stagger={0.06}
              className="text-[12vw] leading-[0.84] font-extrabold tracking-tightest uppercase sm:text-[9vw] lg:text-[6.8vw]"
              lines={[title, ...(accent ? [{ text: accent, className: 'accent normal-case text-blue' }] : [])]}
            />
          </div>
          {(text || children) && (
            <Reveal delay={0.3} className="lg:col-span-4">
              {text && <p className="max-w-md text-sm leading-relaxed text-white/65 sm:text-base">{text}</p>}
              {children}
            </Reveal>
          )}
        </div>
      </div>
    </header>
  )
}
