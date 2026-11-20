import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import { CATEGORIES, CONDITIONS, GENDERS, PRICE_RANGES } from '../../data/categories'
import { cn } from '../../utils/format'

function Group({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <fieldset className="border-b border-ink/10 py-5">
      <legend className="contents">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between text-[11px] font-bold tracking-[0.2em] uppercase"
        >
          {title}
          <Plus
            className={cn('size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]', open && 'rotate-[135deg]')}
            aria-hidden="true"
          />
        </button>
      </legend>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </fieldset>
  )
}

function CheckOption({ label, checked, onChange, count, type = 'checkbox', name }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5 text-sm">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue',
          type === 'radio' && 'rounded-full',
          checked ? 'border-ink bg-ink text-white' : 'border-ink/30 group-hover:border-ink',
        )}
        aria-hidden="true"
      >
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      <span className={cn('flex-1', checked ? 'font-semibold' : 'text-ink/80')}>{label}</span>
      {count !== undefined && <span className="text-xs text-ink/40 tabular-nums">{count}</span>}
    </label>
  )
}

/**
 * Filter controls. `counts` holds facet counts for each option given the other active filters.
 */
export default function FilterPanel({ filters, sizes, counts, onToggle, onSet }) {
  return (
    <div>
      <Group title="Category">
        {CATEGORIES.map((c) => (
          <CheckOption
            key={c.slug}
            label={c.name}
            checked={filters.category.includes(c.slug)}
            onChange={() => onToggle('category', c.slug)}
            count={counts.category[c.slug] || 0}
          />
        ))}
      </Group>

      <Group title="Condition">
        {CONDITIONS.map((c) => (
          <CheckOption
            key={c}
            label={c}
            checked={filters.condition.includes(c)}
            onChange={() => onToggle('condition', c)}
            count={counts.condition[c] || 0}
          />
        ))}
      </Group>

      <Group title="Gender">
        {GENDERS.map((g) => (
          <CheckOption
            key={g}
            label={g}
            checked={filters.gender.includes(g)}
            onChange={() => onToggle('gender', g)}
            count={counts.gender[g] || 0}
          />
        ))}
      </Group>

      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = filters.size.includes(s)
            return (
              <button
                key={s}
                type="button"
                onClick={() => onToggle('size', s)}
                aria-pressed={active}
                className={cn(
                  'h-10 min-w-12 border px-3 text-xs font-semibold transition-colors',
                  active ? 'border-ink bg-ink text-white' : 'border-ink/15 hover:border-ink',
                )}
              >
                {s}
              </button>
            )
          })}
        </div>
      </Group>

      <Group title="Price">
        {PRICE_RANGES.map((r) => (
          <CheckOption
            key={r.id}
            type="radio"
            name="price"
            label={r.label}
            checked={filters.price === r.id}
            onChange={() => onSet('price', filters.price === r.id ? '' : r.id)}
            count={counts.price[r.id] || 0}
          />
        ))}
        {filters.price && (
          <button
            type="button"
            onClick={() => onSet('price', '')}
            className="mt-2 text-xs font-semibold text-ink/60 underline underline-offset-4 hover:text-ink"
          >
            Any price
          </button>
        )}
      </Group>

      <Group title="Availability">
        <CheckOption
          label="In stock only"
          checked={filters.inStock}
          onChange={() => onSet('inStock', filters.inStock ? '' : '1')}
        />
      </Group>
    </div>
  )
}
