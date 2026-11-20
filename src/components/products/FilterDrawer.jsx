import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Button from '../common/Button'
import { useEscapeKey, useLockBodyScroll } from '../../hooks/useLockBodyScroll'

export default function FilterDrawer({ open, onClose, onClear, resultCount, activeCount, children }) {
  useLockBodyScroll(open)
  useEscapeKey(open, onClose)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <motion.button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-ink/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-[90%] max-w-sm flex-col bg-white"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink/10 px-5">
              <p className="text-2xl font-extrabold tracking-tighter uppercase">
                Filter {activeCount > 0 && <span className="accent text-blue">({activeCount})</span>}
              </p>
              <button type="button" onClick={onClose} className="-mr-2 p-2" aria-label="Close filters">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5">{children}</div>
            <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-ink/10 p-4">
              <Button variant="outline" onClick={onClear} disabled={activeCount === 0}>
                Clear all
              </Button>
              <Button onClick={onClose}>Show {resultCount}</Button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
