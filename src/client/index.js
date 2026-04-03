import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

const items = window.__DATA__ || [];
hydrateRoot(
  document.getElementById('root'),
  <BrowserRouter>
    <App items={items} />
  </BrowserRouter>
);
