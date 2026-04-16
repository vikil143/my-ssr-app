const express     = require('express');
const mongoose    = require('mongoose');
const Task        = require('../models/Task');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Every task route requires a valid JWT cookie
router.use(requireAuth);

// ── Constants ────────────────────────────────────────────────────────────────

const VALID_STATUSES   = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Sends a 400 and returns false when the given id is not a valid ObjectId.
 * Lets callers do:  if (!validId(req.params.id, res)) return;
 */
function validId(id, res) {
  if (mongoose.isValidObjectId(id)) return true;
  res.status(400).json({ message: 'Invalid task ID.' });
  return false;
}

/**
 * Surface Mongoose ValidationError field messages as a single readable string.
 */
function mongooseValidationMessage(err) {
  return Object.values(err.errors)
    .map((e) => e.message)
    .join(' ');
}

// ── GET /api/tasks ────────────────────────────────────────────────────────────
// Returns the current user's tasks, newest first.
// Optional query params: ?status=todo  ?priority=high  (ignored if invalid)
router.get('/', async (req, res, next) => {
  try {
    const filter = { userId: req.user.id };

    if (VALID_STATUSES.includes(req.query.status)) {
      filter.status = req.query.status;
    }
    if (VALID_PRIORITIES.includes(req.query.priority)) {
      filter.priority = req.query.priority;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/tasks/:id ────────────────────────────────────────────────────────
// Returns a single task that belongs to the current user.
router.get('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id, res)) return;

    const task = await Task.findOne({
      _id:    req.params.id,
      userId: req.user.id,
    }).lean();

    if (!task) return res.status(404).json({ message: 'Task not found.' });

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/tasks ───────────────────────────────────────────────────────────
// Creates a new task owned by the current user.
//
// Body: { title: string, description?: string, priority?: 'low'|'medium'|'high' }
router.post('/', async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    // Title is required
    const trimmedTitle = String(title ?? '').trim();
    if (!trimmedTitle) {
      return res.status(400).json({ message: 'Task title is required.' });
    }
    if (trimmedTitle.length > 200) {
      return res.status(400).json({ message: 'Title must be 200 characters or fewer.' });
    }

    // Description is optional but bounded
    const trimmedDesc = String(description ?? '').trim();
    if (trimmedDesc.length > 2000) {
      return res.status(400).json({ message: 'Description must be 2000 characters or fewer.' });
    }

    const task = await Task.create({
      title:       trimmedTitle,
      description: trimmedDesc,
      priority:    VALID_PRIORITIES.includes(priority) ? priority : 'medium',
      userId:      req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: mongooseValidationMessage(err) });
    }
    next(err);
  }
});

// ── PUT /api/tasks/:id ────────────────────────────────────────────────────────
// Partially updates a task that belongs to the current user.
// Only fields present in the request body are changed.
//
// Body (all optional): { title?, description?, status?, priority? }
router.put('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id, res)) return;

    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const { title, description, status, priority } = req.body;

    if (title !== undefined) {
      const t = String(title).trim();
      if (!t) {
        return res.status(400).json({ message: 'Title cannot be empty.' });
      }
      if (t.length > 200) {
        return res.status(400).json({ message: 'Title must be 200 characters or fewer.' });
      }
      task.title = t;
    }

    if (description !== undefined) {
      const d = String(description).trim();
      if (d.length > 2000) {
        return res.status(400).json({ message: 'Description must be 2000 characters or fewer.' });
      }
      task.description = d;
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          message: `Status must be one of: ${VALID_STATUSES.join(', ')}.`,
        });
      }
      task.status = status;
    }

    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({
          message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`,
        });
      }
      task.priority = priority;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: mongooseValidationMessage(err) });
    }
    next(err);
  }
});

// ── DELETE /api/tasks/:id ─────────────────────────────────────────────────────
// Permanently removes a task that belongs to the current user.
router.delete('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id, res)) return;

    const task = await Task.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user.id,
    });

    if (!task) return res.status(404).json({ message: 'Task not found.' });

    res.json({ message: 'Task deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
