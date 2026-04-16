import React from 'react';
import { NavLink, Route, Routes, StaticRouter, useNavigate } from 'react-router-dom';
import HomePage     from './app/page.jsx';
import AboutPage    from './app/about/page.jsx';
import ItemsPage    from './app/items/page.jsx';
import ShowcasePage from './app/showcase/page.jsx';
import LoginPage    from './app/login/page.jsx';
import RegisterPage from './app/register/page.jsx';
import NotFoundPage from './app/not-found.jsx';
import ThemeToggle  from './theme/ThemeToggle.jsx';
import { ThemeProvider }  from './theme/ThemeProvider.jsx';
import ErrorBoundary      from './components/ErrorBoundary.jsx';
import ProtectedRoute     from './components/ProtectedRoute.jsx';
import { ToastProvider }  from './context/ToastContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-cyan-500 text-witemshite shadow-lg shadow-cyan-500/30 dark:bg-cyan-400 dark:text-slate-950'
                : 'text-slate-600 hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
            }`
          }
        >
          Sign in
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 dark:bg-cyan-400 dark:text-slate-950'
                : 'border border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-400/10'
            }`
          }
        >
          Register
        </NavLink>
      </div>
    );
  }

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:block">
        Hi,{' '}
        <span className="font-semibold text-slate-900 dark:text-white">
          {user.name}
        </span>
      </span>
      <button
        onClick={handleLogout}
        className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
}

function AppShell({ items = [] }) {
  const { user } = useAuth();

  const navLinkClassName = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 dark:bg-cyan-400 dark:text-slate-950'
        : 'text-slate-600 hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.18),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_48%,_#cbd5e1_100%)] px-4 py-10 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.24),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_55%,_#111827_100%)] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-[2rem] border border-slate-900/10 bg-white/70 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur transition-colors duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-700 dark:text-cyan-300">
            React SSR
          </p>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                My SSR App
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                Server-rendered routes with a Tailwind-powered client shell and a persistent theme switch.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <nav className="flex flex-wrap gap-3">
                <NavLink to="/" className={navLinkClassName}>Home</NavLink>
                <NavLink to="/about" className={navLinkClassName}>About</NavLink>
                {user && (
                  <NavLink to="/items" className={navLinkClassName}>Items</NavLink>
                )}
                <NavLink to="/showcase" className={navLinkClassName}>Showcase</NavLink>
              </nav>
              <UserMenu />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="rounded-[2rem] border border-slate-900/10 bg-white/75 p-6 shadow-xl shadow-slate-900/10 backdrop-blur transition-colors duration-300 dark:border-white/10 dark:bg-slate-900/65 dark:shadow-slate-950/40 sm:p-8">
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/showcase" element={<ShowcasePage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected — requires authentication */}
            <Route
              path="/items"
              element={
                <ProtectedRoute>
                  <ItemsPage items={items} />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App({ items = [], location }) {
  const appShell = (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ErrorBoundary>
            <AppShell items={items} />
          </ErrorBoundary>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );

  if (location) {
    return (
      <StaticRouter location={location}>
        {appShell}
      </StaticRouter>
    );
  }

  return appShell;
}
