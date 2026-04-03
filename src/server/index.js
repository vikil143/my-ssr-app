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
  return `
  <html>
    <head><title>My SSR App</title></head>
    <body>
      <div id="root">${html}</div>
      <script>window.__DATA__ = ${JSON.stringify(items)}</script>
      <script src="/bundle.js"></script>
    </body>
  </html>`;
}

// API route — returns JSON for client-side use
app.get('/api/items', async (req, res) => {
  const items = await Item.find().lean();
  res.json(items);
});

// SSR route — renders React on the server for app routes
app.get(/^\/(?!api).*/, async (req, res) => {
  const items = await Item.find().lean();
  const html = renderToString(React.createElement(App, { items, location: req.url }));
  console.log(`SSR for ${req.url} with ${items.length} items`);
  res.send(renderPage(html, items));
});

connect().then(() => app.listen(3000, () =>
  console.log('Server running at http://localhost:3000')
));
