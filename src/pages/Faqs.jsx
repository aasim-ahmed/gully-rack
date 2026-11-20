import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import Seo from '../components/common/Seo'
import PageHeader from '../components/common/PageHeader'
import Accordion, { AccordionItem } from '../components/common/Accordion'
import { ButtonLink } from '../components/common/Button'
import { FAQS } from '../data/site'

export default function Faqs() {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return FAQS
    return FAQS.map((g) => ({
      ...g,
      items: g.items.filter((i) => `${i.q} ${i.a}`.toLowerCase().includes(q)),
    })).filter((g) => g.items.length)
  }, [query])

  return (
    <>
      <Seo title="FAQs" description="Answers about pre-loved condition grades, sizing, payments, shipping and returns at GULLY RACK." />
      <PageHeader crumbs={[{ label: 'FAQs' }]} eyebrow="Help centre" title="Frequently asked" accent="questions">
        <div className="relative max-w-md">
          <label htmlFor="faq-search" className="sr-only">
            Search FAQs
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-white/50" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            className="h-12 w-full border-b border-white/30 bg-transparent pl-7 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-blue"
          />
        </div>
      </PageHeader>

      <div className="container-x grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-12">
        <nav aria-label="FAQ sections" className="hidden lg:col-span-3 lg:block">
          <ul className="sticky top-24 space-y-3">
            {FAQS.map((g) => (
              <li key={g.group}>
                <a href={`#${g.group.replace(/\W+/g, '-').toLowerCase()}`} className="text-sm font-semibold text-ink/60 hover:text-ink">
                  {g.group}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-14 lg:col-span-9">
          {groups.length === 0 && (
            <p className="text-sm text-ink/60">
              No questions match “{query}”. Try another word, or contact us directly.
            </p>
          )}
          {groups.map((g) => (
            <section key={g.group} id={g.group.replace(/\W+/g, '-').toLowerCase()} className="scroll-mt-28">
              <h2 className="mb-4 text-lg font-extrabold uppercase">{g.group}</h2>
              <Accordion>
                {g.items.map((item) => (
                  <AccordionItem key={item.q} title={item.q} defaultOpen={!!query.trim()}>
                    {item.a}
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}

          <div className="flex flex-col items-start gap-5 bg-mist p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-base font-bold uppercase">Still have a question?</p>
              <p className="mt-1 text-sm text-ink/60">We reply within 24 hours, Monday to Saturday.</p>
            </div>
            <ButtonLink to="/contact">Contact us</ButtonLink>
          </div>
        </div>
      </div>
    </>
  )
}
