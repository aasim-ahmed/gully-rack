import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Clock, Mail, MapPin, Send } from 'lucide-react'
import Seo from '../components/common/Seo'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import { InstagramIcon } from '../components/common/SocialIcons'
import { SITE } from '../data/site'
import { isValidEmail, isValidPhone, required, validate } from '../utils/validation'

const TOPICS = ['Order help', 'Returns & refunds', 'Product question', 'Sell to us', 'Collaborations', 'Something else']

const RULES = {
  name: required('Name'),
  email: (v) => (!v.trim() ? 'Email is required.' : !isValidEmail(v) ? 'Enter a valid email address.' : undefined),
  phone: (v) => (v.trim() && !isValidPhone(v) ? 'Enter a valid 10-digit mobile number.' : undefined),
  topic: required('Topic'),
  message: (v) =>
    !v.trim() ? 'Message is required.' : v.trim().length < 10 ? 'Please add a little more detail (10+ characters).' : undefined,
}

const INITIAL = { name: '', email: '', phone: '', orderId: '', topic: '', message: '' }

export default function Contact() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: RULES[name]?.(value) }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validate(values, RULES)
    setErrors(found)
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(RULES).find((k) => found[k])}"]`)?.focus()
      return
    }
    setSending(true)
    // Frontend simulation — connect to a form service or support inbox later.
    setTimeout(() => {
      setSending(false)
      setValues(INITIAL)
      toast.success('Message sent', { description: 'We usually reply within 24 hours on business days.' })
    }, 900)
  }

  const field = (id) => ({ id, value: values[id], onChange, error: errors[id] })

  return (
    <>
      <Seo title="Contact Us" description="Questions about an order, a product or selling to GULLY RACK? Get in touch — we reply within 24 hours on business days." />
      <PageHeader
        crumbs={[{ label: 'Contact' }]}
        eyebrow="We’re listening"
        title="Get in"
        accent="touch."
        text="Order question, sizing doubt or a closet you want to clear out? Drop us a message — real people reply."
      />

      <div className="container-x grid grid-cols-1 gap-14 py-14 sm:py-20 lg:grid-cols-12">
        <aside className="space-y-8 lg:col-span-4">
          {[
            { icon: Mail, title: 'Email', body: <a href={`mailto:${SITE.email}`} className="link-underline">{SITE.email}</a> },
            {
              icon: InstagramIcon,
              title: 'Instagram DMs',
              body: (
                <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
                  @{SITE.instagram}
                </a>
              ),
            },
            { icon: Clock, title: 'Support hours', body: 'Mon – Sat, 10:00 AM – 7:00 PM IST' },
            { icon: MapPin, title: 'Where we are', body: 'Online-only store, shipping across India' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center bg-mist">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold tracking-[0.15em] uppercase">{title}</p>
                <p className="mt-1 text-sm text-ink/70">{body}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-ink/10 pt-8 text-sm text-ink/60">
            Looking for a quick answer? Check our <Link to="/faqs" className="font-semibold text-ink underline">FAQs</Link>{' '}
            or <Link to="/shipping" className="font-semibold text-ink underline">shipping info</Link>.
          </div>
        </aside>

        <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          <FormField label="Name" autoComplete="name" {...field('name')} />
          <FormField label="Email" type="email" inputMode="email" autoComplete="email" {...field('email')} />
          <FormField label="Phone" type="tel" inputMode="tel" autoComplete="tel-national" optional {...field('phone')} />
          <FormField label="Order number" optional placeholder="e.g. GR12345678" {...field('orderId')} />
          <FormField label="Topic" as="select" className="sm:col-span-2" {...field('topic')}>
            <option value="">Choose a topic</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </FormField>
          <FormField label="Message" as="textarea" rows={6} className="sm:col-span-2" {...field('message')} />
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" loading={sending}>
              {!sending && <Send className="size-4" />} {sending ? 'Sending…' : 'Send message'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
