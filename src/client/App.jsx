import React from 'react';
import { NavLink, Route, Routes, StaticRouter } from 'react-router-dom';
import HomePage from './app/page.jsx';
import AboutPage from './app/about/page.jsx';
import ItemsPage from './app/items/page.jsx';
import NotFoundPage from './app/not-found.jsx';

function AppShell({ items = [] }) {
  return (
    <div>
      <h1>My SSR App</h1>
      <nav>
        <NavLink to="/">Home</NavLink>{' | '}
        <NavLink to="/about">About</NavLink>{' | '}
        <NavLink to="/items">Items</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/items" element={<ItemsPage items={items} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
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
