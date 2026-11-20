import { ButtonLink } from './Button'

export default function EmptyState({ icon: Icon, title, text, action, secondary }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:py-28">
      {Icon && (
        <Icon className="mb-8 size-10 text-ink/25" strokeWidth={1.25} aria-hidden="true" />
      )}
      <h2 className="heading-lg text-balance">{title}</h2>
      {text && <p className="mt-4 text-sm leading-relaxed text-ink/60">{text}</p>}
      {(action || secondary) && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {action && <ButtonLink to={action.to}>{action.label}</ButtonLink>}
          {secondary && (
            <ButtonLink to={secondary.to} variant="outline">
              {secondary.label}
            </ButtonLink>
          )}
        </div>
      )}
    </div>
  )
}
