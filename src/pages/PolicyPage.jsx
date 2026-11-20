import { NavLink } from 'react-router-dom'
import Seo from '../components/common/Seo'
import PageHeader from '../components/common/PageHeader'
import { ButtonLink } from '../components/common/Button'
import { POLICIES } from '../data/policies'
import { cn } from '../utils/format'

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export default function PolicyPage({ policy }) {
  const page = POLICIES[policy]
  const updated = new Date(page.updated).toLocaleDateString('en-IN', { dateStyle: 'long' })

  return (
    <>
      <Seo title={page.title} description={page.description} />
      <PageHeader crumbs={[{ label: page.title }]} eyebrow="Help & policies" title={page.title} text={page.intro} />

      <div className="container-x grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-12">
        <aside className="min-w-0 lg:col-span-3">
          <nav aria-label="Policies" className="lg:sticky lg:top-24">
            <p className="eyebrow mb-4 text-ink/40">Policies</p>
            <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
              {Object.entries(POLICIES).map(([key, p]) => (
                <li key={key} className="shrink-0">
                  <NavLink
                    to={p.path}
                    className={({ isActive }) =>
                      cn(
                        'block border px-4 py-2 text-xs font-semibold uppercase transition-colors lg:border-0 lg:border-l-2 lg:py-2.5',
                        isActive ? 'border-ink bg-ink text-white lg:bg-transparent lg:text-ink' : 'border-ink/15 text-ink/60 hover:text-ink',
                      )
                    }
                  >
                    {p.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl lg:col-span-9">
          <p className="mb-10 text-xs text-ink/50">Last updated: {updated}</p>
          <div className="space-y-12">
            {page.sections.map((s) => (
              <section key={s.heading} id={slugify(s.heading)} aria-labelledby={`${slugify(s.heading)}-h`}>
                <h2 id={`${slugify(s.heading)}-h`} className="mb-4 text-lg font-extrabold uppercase">
                  {s.heading}
                </h2>
                {s.table && (
                  <div className="mb-5 overflow-x-auto">
                    <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="bg-ink text-white">
                          {s.table.head.map((h) => (
                            <th key={h} scope="col" className="px-4 py-3 text-[11px] font-semibold tracking-[0.12em] uppercase">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.rows.map((row) => (
                          <tr key={row[0]} className="border-b border-ink/10">
                            {row.map((cell, i) => (
                              <td key={i} className={cn('px-4 py-3', i === 0 ? 'font-semibold' : 'text-ink/70')}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <ul className="space-y-3 text-sm leading-relaxed text-ink/70 sm:text-base">
                  {s.body.map((para) => (
                    <li key={para} className="relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-blue">
                      {para}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start gap-5 bg-mist p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-base font-bold uppercase">Need help with an order?</p>
              <p className="mt-1 text-sm text-ink/60">Our team replies within 24 hours, Monday to Saturday.</p>
            </div>
            <ButtonLink to="/contact">Contact us</ButtonLink>
          </div>
        </article>
      </div>
    </>
  )
}
