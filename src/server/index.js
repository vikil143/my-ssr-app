require('dotenv').config();
require('@babel/register')({ presets: ['@babel/preset-env', '@babel/preset-react'] });

const express      = require('express');
const cookieParser = require('cookie-parser');
const jwt          = require('jsonwebtoken');
const React        = require('react');
const { renderToString } = require('react-dom/server');
const swaggerUi    = require('swagger-ui-express');

const passport     = require('passport');
const connect      = require('./db');
const Item         = require('./models/Item');
const Task         = require('./models/Task');
const authRouter   = require('./routes/auth');
const tasksRouter  = require('./routes/tasks');
const requireAuth  = require('./middleware/auth');
const swaggerSpec  = require('./swagger');
const App          = require('../client/App').default;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(passport.initialize());

// ── API Docs ─────────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Auth API ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);

// ── Tasks API ────────────────────────────────────────────────────────────────
app.use('/api/tasks', tasksRouter);

// ── Items API (kept for backward compatibility) ──────────────────────────────
app.get('/api/items', async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post('/api/items', requireAuth, async (req, res, next) => {
  try {
    const { name } = req.body;
    const trimmed = String(name ?? '').trim();
    if (!trimmed) {
      return res.status(400).json({ message: 'Item name is required.' });
    }
    const item = await Item.create({ name: trimmed });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

// ── SSR ─────────────────────────────────────────────────────────────────────
function renderPage(html, data) {
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
    <script>window.__DATA__ = ${JSON.stringify(data)}</script>
    <script src="/bundle.js" defer></script>
  </body>
</html>`;
}

// Routes that don't need live DB data — rendered once at startup
const STATIC_ROUTES = ['/', '/about', '/login', '/register'];
const preRenderedCache = new Map();

function preRenderPages() {
  for (const route of STATIC_ROUTES) {
    const html = renderToString(React.createElement(App, { tasks: [], location: route }));
    preRenderedCache.set(route, renderPage(html, { tasks: [] }));
    console.log(`Pre-rendered: ${route}`);
  }
}

// SSR catch-all — static pages served from cache, /tasks rendered fresh per-user
app.get(/^\/(?!api).*/, async (req, res) => {
  if (preRenderedCache.has(req.path)) {
    console.log(`Serving pre-rendered: ${req.path}`);
    return res.send(preRenderedCache.get(req.path));
  }

  // /tasks — fetch the logged-in user's tasks from their JWT cookie
  let tasks = [];
  if (req.path === '/tasks') {
    try {
      const token = req.cookies.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        tasks = await Task.find({ userId: decoded.id }).sort({ createdAt: -1 }).lean();
      }
    } catch (_) {
      // Invalid / expired token — leave tasks empty; ProtectedRoute will redirect
    }
  }

  const html = renderToString(React.createElement(App, { tasks, location: req.url }));
  console.log(`SSR for ${req.url} with ${tasks.length} tasks`);
  res.send(renderPage(html, { tasks }));
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  // Mongoose validation errors → 400
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(' ');
    return res.status(400).json({ message });
  }
  // Mongoose duplicate key (e.g. unique email) → 409
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists.' });
  }
  // Mongoose bad ObjectId cast → 400
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }

  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal server error.' });
});

connect().then(() => {
  preRenderPages();
  app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`)
  );
});
