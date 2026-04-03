import React from 'react';
import { NavLink, Route, Routes, StaticRouter } from 'react-router-dom';
import HomePage from './app/page.jsx';
import AboutPage from './app/about/page.jsx';
import ItemsPage from './app/items/page.jsx';
import NotFoundPage from './app/not-found.jsx';

function AppShell({ items = [] }) {
  const navLinkClassName = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-cyan-400 text-slate-950'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.24),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_55%,_#111827_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
            React SSR
          </p>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                My SSR App
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Server-rendered routes with a Tailwind-powered client shell.
              </p>
            </div>
            <nav className="flex flex-wrap gap-3">
              <NavLink to="/" className={navLinkClassName}>
                Home
              </NavLink>
              <NavLink to="/about" className={navLinkClassName}>
                About
              </NavLink>
              <NavLink to="/items" className={navLinkClassName}>
                Items
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="rounded-[2rem] border border-white/10 bg-slate-900/65 p-6 shadow-xl shadow-slate-950/40 backdrop-blur sm:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/items" element={<ItemsPage items={items} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App({ items = [], location }) {
  if (location) {
    return (
      <StaticRouter location={location}>
        <AppShell items={items} />
      </StaticRouter>
    );
  }

  return <AppShell items={items} />;
}
