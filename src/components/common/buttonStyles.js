import { cn } from '../../utils/format'

/*
 * Buttons are hard-edged blocks. On hover a fill sweeps up from the bottom edge
 * (the ::before layer) instead of a flat colour swap.
 */
const VARIANTS = {
  primary: 'bg-ink text-white border border-ink before:bg-blue hover:border-blue',
  blue: 'bg-blue text-white border border-blue before:bg-white hover:text-ink hover:border-white',
  blueDark: 'bg-blue text-white border border-blue before:bg-ink hover:border-ink',
  outline: 'bg-transparent text-ink border border-ink before:bg-ink hover:text-white',
  white: 'bg-white text-ink border border-white before:bg-blue hover:text-white hover:border-blue',
  ghostLight: 'bg-transparent text-white border border-white/40 before:bg-white hover:text-ink hover:border-white',
  ghost: 'bg-transparent text-ink border border-transparent before:bg-mist',
}

const SIZES = {
  sm: 'h-10 px-4 text-[10px]',
  md: 'h-12 px-6 text-[11px]',
  lg: 'h-14 px-8 text-[11px] sm:h-16 sm:px-10 sm:text-xs',
}

const BASE = cn(
  'relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden font-semibold tracking-[0.2em] uppercase select-none',
  'transition-[color,border-color,transform] duration-300 active:scale-[0.98]',
  'before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)] hover:before:scale-y-100',
  'disabled:pointer-events-none disabled:opacity-40',
)

export function buttonClasses({ variant = 'primary', size = 'md', block = false, className } = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size], block && 'w-full', className)
}
