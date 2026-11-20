export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

// Indian mobile numbers: 10 digits starting 6–9, optional +91 / 0 prefix.
export const normalisePhone = (v) => v.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '')
export const isValidPhone = (v) => /^[6-9]\d{9}$/.test(normalisePhone(v))

export const isValidPincode = (v) => /^[1-9]\d{5}$/.test(v.trim())

/**
 * Runs a map of field -> validator(value, values) and returns an errors object.
 * Validators return an error message string, or nothing when valid.
 */
export function validate(values, rules) {
  return Object.entries(rules).reduce((errors, [field, rule]) => {
    const message = rule(values[field] ?? '', values)
    if (message) errors[field] = message
    return errors
  }, {})
}

export const required = (label) => (v) => (String(v).trim() ? undefined : `${label} is required.`)
