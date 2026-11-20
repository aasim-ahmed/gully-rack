import { cn } from '../../utils/format'

/** Clear New vs Pre-Loved label. Pre-loved items are never styled to look new. */
export default function ConditionBadge({ product, className, showGrade = false }) {
  const preLoved = product.condition === 'Pre-Loved'
  return (
    <span
      className={cn(
        'label inline-flex items-center gap-1.5 px-1.5 py-1 font-bold',
        preLoved ? 'bg-ink text-white' : 'bg-white text-blue ring-1 ring-blue ring-inset',
        className,
      )}
    >
      {preLoved ? 'Pre-Loved' : 'New'}
      {preLoved && showGrade && product.conditionGrade && (
        <span className="font-medium text-white/70">· {product.conditionGrade}</span>
      )}
    </span>
  )
}
