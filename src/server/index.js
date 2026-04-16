require('@babel/register')({ presets: ['@babel/preset-env','@babel/preset-react'] });
const express  = require('express');
const React    = require('react');
const { renderToString } = require('react-dom/server');
const connect  = require('./db');
const Item     = require('./models/Item');
const App      = require('../client/App').default;

const app = express();
app.use(express.json());
app.use(express.static('public'));

function renderPage(html, items) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My SSR App</title>
    <link rel="stylesheet" href="/bundle.css" />
    <script>
      try {
        var t = localStorage.getItem('theme');
        if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      } catch(e) {}
    </script>
  </head>
  <body>
    <div id="root">${html}</div>
    <script>window.__DATA__ = ${JSON.stringify(items)}</script>
    <script src="/bundle.js" defer></script>
  </body>
</html>`;
}

// API route — returns JSON for client-side use
app.get('/api/items', async (req, res) => {
  const items = await Item.find().lean();
  res.json(items);
});

// API route — create a new item
app.post('/api/items', async (req, res) => {
  const { name } = req.body;
  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: 'Item name is required.' });
  }
  const item = await Item.create({ name: String(name).trim() });
  res.status(201).json(item);
});

// Routes that don't need live DB data — rendered once at startup
const STATIC_ROUTES = ['/', '/about', '/showcase'];
const preRenderedCache = new Map();

function preRenderPages() {
  for (const route of STATIC_ROUTES) {
    const html = renderToString(React.createElement(App, { items: [], location: route }));
    preRenderedCache.set(route, renderPage(html, []));
    console.log(`Pre-rendered: ${route}`);
  }
}

// SSR route — serves pre-rendered HTML for static pages, renders on-demand for dynamic ones
app.get(/^\/(?!api).*/, async (req, res) => {
  if (preRenderedCache.has(req.path)) {
    console.log(`Serving pre-rendered: ${req.path}`);
    return res.send(preRenderedCache.get(req.path));
  }

  // Dynamic pages (e.g. /items) still fetch fresh data on every request
  const items = await Item.find().lean();
  const html = renderToString(React.createElement(App, { items, location: req.url }));
  console.log(`SSR for ${req.url} with ${items.length} items`);
  res.send(renderPage(html, items));
});

connect().then(() => {
  preRenderPages();
  app.listen(3000, () => console.log('Server running at http://localhost:3000'));
});
