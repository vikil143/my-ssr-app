import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section>
      <h2>Home</h2>
      <p>This is the SSR home page.</p>
      <p>
        Visit the <Link to="/items">items page</Link> to see server data.
      </p>
    </section>
  );
}
