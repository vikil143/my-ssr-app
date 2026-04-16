import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import TextInput from '../../components/TextInput.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ApiError } from '../../lib/api.js';
import useFormValidation from '../../hooks/useFormValidation.js';

const SCHEMA = {
  name:            ['required'],
  email:           ['required', 'email'],
  password:        ['required', (v) => (v && v.length < 6 ? 'Password must be at least 6 characters.' : null)],
  confirmPassword: ['required'],
};

export default function RegisterPage() {
  const { register, user, loading } = useAuth();
  const { addToast }                = useToast();
  const navigate                    = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { values, errors, handleChange, handleBlur, validate } =
    useFormValidation(SCHEMA);

  // Redirect already-authenticated users after auth state resolves
  useEffect(() => {
    if (!loading && user) {
      navigate('/items', { replace: true });
    }
  }, [user, loading, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    if (values.password !== values.confirmPassword) return;

    setSubmitting(true);
    try {
      await register(values.name, values.email, values.password);
      addToast('Account created! Welcome aboard.', 'success');
      // navigation handled by the useEffect above once user state updates
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Registration failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const passwordMismatch =
    values.confirmPassword && values.password !== values.confirmPassword;

  if (loading) return null;

  return (
    <section className="mx-auto max-w-sm space-y-6 py-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          Create account
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sign up to start creating items.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextInput
          name="name"
          label="Full name"
          placeholder="Jane Smith"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          disabled={submitting}
          autoComplete="name"
        />

        <TextInput
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          disabled={submitting}
          autoComplete="email"
        />

        <TextInput
          name="password"
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          disabled={submitting}
          autoComplete="new-password"
        />

        <TextInput
          name="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword || (passwordMismatch ? 'Passwords do not match.' : null)}
          disabled={submitting}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          disabled={submitting || !!passwordMismatch}
          className="w-full"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-cyan-600 hover:underline dark:text-cyan-400"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
