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
        <h2 className="text-xl font-bold tracking-tight text-j-ink dark:text-white">
          Create account
        </h2>
        <p className="text-sm text-j-sub dark:text-slate-400">
          Sign up to start creating items.
        </p>
      </div>

      {/* Google OAuth — full-page redirect, not AJAX */}
      <a
        href="/api/auth/google"
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </a>

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-slate-200 dark:border-slate-700" />
        <span className="text-xs text-j-sub dark:text-slate-500">or</span>
        <hr className="flex-1 border-slate-200 dark:border-slate-700" />
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

      <p className="text-center text-sm text-j-sub dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-j-blue hover:underline dark:text-blue-400"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
