import React, { useState, useEffect } from 'react';
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
  const { login, user, loading } = useAuth();
  const { addToast }             = useToast();
  const navigate                 = useNavigate();
  const location                 = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const { values, errors, handleChange, handleBlur, validate } =
    useFormValidation(SCHEMA);

  // Redirect after auth state resolves — never navigate during render
  useEffect(() => {
    if (!loading && user) {
      const dest = location.state?.from?.pathname || '/items';
      navigate(dest, { replace: true });
    }
  }, [user, loading, navigate, location]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(values.email, values.password);
      addToast('Welcome back!', 'success');
      // navigation handled by the useEffect above once user state updates
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Login failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  // While auth is loading, render nothing (ProtectedRoute already shows spinner)
  if (loading) return null;

  return (
    <section className="mx-auto max-w-sm space-y-6 py-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-j-ink dark:text-white">
          Sign in
        </h2>
        <p className="text-sm text-j-sub dark:text-slate-400">
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

      <p className="text-center text-sm text-j-sub dark:text-slate-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-j-blue hover:underline dark:text-blue-400"
        >
          Create one
        </Link>
      </p>
    </section>
  );
}
