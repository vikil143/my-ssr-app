import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

const items = window.__DATA__?.items || [];
hydrateRoot(
  document.getElementById('root'),
  <BrowserRouter>
    <App items={items} />
  </BrowserRouter>
);
