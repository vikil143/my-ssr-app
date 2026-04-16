import React from 'react';
import { NavLink, Route, Routes, StaticRouter, useNavigate } from 'react-router-dom';
import HomePage     from './app/page.jsx';
import AboutPage    from './app/about/page.jsx';
import ItemsPage    from './app/items/page.jsx';
import TasksPage    from './app/tasks/page.jsx';
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
            `rounded-[3px] px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? 'bg-j-blue text-white'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          Sign in
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) =>
            `rounded-[3px] px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? 'bg-j-blue text-white'
                : 'border border-white/30 text-white/80 hover:bg-white/10 hover:text-white'
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
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-white/70 sm:block">
        Hi,{' '}
        <span className="font-semibold text-white">
          {user.name}
        </span>
      </span>
      <button
        onClick={handleLogout}
        className="rounded-[3px] px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
}

function AppShell({ tasks = [] }) {
  const { user } = useAuth();

  const navLinkClassName = ({ isActive }) =>
    `rounded-[3px] px-3 py-1.5 text-sm font-medium transition ${
      isActive
        ? 'bg-j-blue text-white'
        : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-j-snow transition-colors duration-300 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-[4px] border-0 bg-j-navy px-6 py-4 shadow-sm transition-colors duration-300 dark:bg-slate-900">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            React SSR
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                My SSR App
              </h1>
              <p className="mt-0.5 max-w-2xl text-xs leading-5 text-white/60">
                Server-rendered routes with a Tailwind-powered client shell and a persistent theme switch.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <nav className="flex flex-wrap gap-1">
                <NavLink to="/" className={navLinkClassName}>Home</NavLink>
                <NavLink to="/about" className={navLinkClassName}>About</NavLink>
                {user && (
                  <NavLink to="/tasks" className={navLinkClassName}>Tasks</NavLink>
                )}
              </nav>
              <UserMenu />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="rounded-[4px] border border-j-line bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected — requires authentication */}
            <Route
              path="/items"
              element={
                <ProtectedRoute>
                  <ItemsPage items={[]} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TasksPage tasks={tasks} />
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

export default function App({ tasks = [], location }) {
  const appShell = (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ErrorBoundary>
            <AppShell tasks={tasks} />
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
