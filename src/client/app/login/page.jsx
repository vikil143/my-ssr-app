import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/Button.jsx';
import TextInput from '../../components/TextInput.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ApiError } from '../../lib/api.js';
import useFormValidation from '../../hooks/useFormValidation.js';

const SCHEMA = {
  email:    ['required', 'email'],
  password: ['required'],
};

export default function LoginPage() {
  const { login, user } = useAuth();
  const { addToast }    = useToast();
  const navigate        = useNavigate();
  const location        = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const { values, errors, handleChange, handleBlur, validate } =
    useFormValidation(SCHEMA);

  // If already logged in, redirect away from this page
  if (user) {
    const dest = location.state?.from?.pathname || '/items';
    navigate(dest, { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(values.email, values.password);
      addToast('Welcome back!', 'success');
      const dest = location.state?.from?.pathname || '/items';
      navigate(dest, { replace: true });
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Login failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-sm space-y-6 py-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          Sign in
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your credentials to access your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
          placeholder="Your password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          disabled={submitting}
          autoComplete="current-password"
        />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-cyan-600 hover:underline dark:text-cyan-400"
        >
          Create one
        </Link>
      </p>
    </section>
  );
}
