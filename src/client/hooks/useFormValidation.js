import { useState } from 'react';

// Built-in validators — each returns an error string or null
const VALIDATORS = {
  required: (v) =>
    !v || !String(v).trim() ? 'This field is required.' : null,
  email: (v) =>
    v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? 'Enter a valid email address.'
      : null,
  minLength: (min) => (v) =>
    v && v.length < min ? `Must be at least ${min} characters.` : null,
  maxLength: (max) => (v) =>
    v && v.length > max ? `Must be at most ${max} characters.` : null,
};

function runRules(value, rules = []) {
  for (const rule of rules) {
    const err =
      typeof rule === 'string'
        ? VALIDATORS[rule]?.(value)
        : typeof rule === 'function'
        ? rule(value)
        : null;
    if (err) return err;
  }
  return null;
}

/**
 * useFormValidation
 *
 * @param {Record<string, Array>} schema
 *   e.g. { name: ['required', VALIDATORS.minLength(2)], email: ['required', 'email'] }
 *
 * @returns {{ values, errors, touched, handleChange, handleBlur, validate, reset }}
 */
export default function useFormValidation(schema) {
  const fields = Object.keys(schema);
  const initial = Object.fromEntries(fields.map((k) => [k, '']));

  const [values, setValues]   = useState(initial);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Re-validate only already-touched fields so errors don't fire mid-typing
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: runRules(value, schema[name]) }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: runRules(value, schema[name]) }));
  }

  /** Validate all fields at once. Returns true if the form is valid. */
  function validate() {
    const newErrors = {};
    for (const [field, rules] of Object.entries(schema)) {
      const err = runRules(values[field], rules);
      if (err) newErrors[field] = err;
    }
    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map((k) => [k, true])));
    return Object.keys(newErrors).length === 0;
  }

  function reset() {
    setValues(initial);
    setErrors({});
    setTouched({});
  }

  return { values, errors, touched, handleChange, handleBlur, validate, reset, VALIDATORS };
}
