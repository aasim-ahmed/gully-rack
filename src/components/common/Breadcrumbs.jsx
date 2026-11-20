import { Link } from 'react-router-dom'
import { cn } from '../../utils/format'

export default function Breadcrumbs({ items, className }) {
  const all = [{ label: 'Home', to: '/' }, ...items]
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="label flex flex-wrap items-center gap-1.5 gap-y-1">
        {all.map((item, i) => {
          const last = i === all.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.to && !last ? (
                <Link to={item.to} className="link-underline opacity-55 transition-opacity hover:opacity-100">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(!last && 'opacity-55')} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <span className="opacity-30" aria-hidden="true">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
