import { Link } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { buttonClasses } from './buttonStyles'

export default function Button({
  variant,
  size,
  block,
  loading = false,
  className,
  children,
  type = 'button',
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function ButtonLink({ to, variant, size, block, className, children, ...props }) {
  return (
    <Link to={to} className={buttonClasses({ variant, size, block, className })} {...props}>
      {children}
    </Link>
  )
}
