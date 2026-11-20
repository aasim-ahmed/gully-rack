import { Link } from 'react-router-dom'
import Seo from '../components/common/Seo'
import { ButtonLink } from '../components/common/Button'
import { CATEGORIES } from '../data/categories'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" noIndex />
      <section className="container-x flex min-h-[70vh] flex-col justify-center py-20">
        <p className="eyebrow text-blue">Error 404</p>
        <h1 className="mt-4 text-[28vw] leading-[0.8] font-extrabold tracking-tightest sm:text-[18vw] lg:text-[14rem]">
          4<span className="text-blue">0</span>4
        </h1>
        <p className="mt-8 max-w-md text-xl font-bold uppercase">
          Wrong gully. <span className="accent font-normal text-ink/70">This page doesn’t exist.</span>
        </p>
        <p className="mt-3 max-w-md text-sm text-ink/60">
          The link may be broken, or the page may have moved. The good stuff is still on the rack.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/" size="lg">
            Back home
          </ButtonLink>
          <ButtonLink to="/shop" variant="outline" size="lg">
            Shop all
          </ButtonLink>
        </div>
        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold tracking-[0.12em] uppercase">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop?category=${c.slug}`} className="link-underline text-ink/60 hover:text-ink">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
