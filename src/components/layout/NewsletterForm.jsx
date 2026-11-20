import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowRight, Check, LoaderCircle } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { isValidEmail } from '../../utils/validation'
import { cn } from '../../utils/format'

/** "The Drop List" sign-up. Frontend simulation — swap the timeout for the email provider's API. */
export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useLocalStorage('gr:newsletter', null)

  const submit = (e) => {
    e.preventDefault()
    const value = email.trim()
    if (!isValidEmail(value)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubscribed(value)
      setEmail('')
      toast.success('You’re on the list', { description: 'First access to Friday drops is coming your way.' })
    }, 700)
  }

  if (subscribed) {
    return (
      <div className="flex items-start gap-4 border-b border-white/20 pb-6" role="status">
        <span className="flex size-10 shrink-0 items-center justify-center bg-blue text-white">
          <Check className="size-5" />
        </span>
        <div>
          <p className="font-semibold">You’re on the list with {subscribed}.</p>
          <p className="mt-1 text-sm text-white/60">Watch your inbox on Friday mornings.</p>
          <button
            type="button"
            onClick={() => setSubscribed(null)}
            className="link-underline mt-3 text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="newsletter-email" className="eyebrow mb-2 block text-white/50">
        Email address
      </label>
      <div
        className={cn(
          'group flex items-center border-b transition-colors focus-within:border-blue',
          error ? 'border-danger' : 'border-white/30',
        )}
      >
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError('')
          }}
          placeholder="you@example.com"
          aria-invalid={!!error}
          aria-describedby={error ? 'newsletter-error' : undefined}
          className="h-14 min-w-0 flex-1 bg-transparent text-lg font-medium text-white outline-none placeholder:text-white/30 sm:text-2xl"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-14 items-center gap-3 pl-4 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors hover:text-blue disabled:opacity-60"
        >
          {loading ? 'Joining' : 'Join'}
          {loading ? (
            <LoaderCircle className="size-5 animate-spin" />
          ) : (
            <ArrowRight className="size-5 transition-transform group-focus-within:translate-x-1" />
          )}
        </button>
      </div>
      {error && (
        <p id="newsletter-error" className="mt-2 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
      <p className="mt-3 text-[11px] text-white/40">
        By joining you agree to our{' '}
        <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-white">
          Privacy Policy
        </Link>
        . Unsubscribe anytime.
      </p>
    </form>
  )
}
