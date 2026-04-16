const express    = require('express');
const Task       = require('../models/Task');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// All task routes require a valid JWT cookie
router.use(requireAuth);

// GET /api/tasks — return only the current user's tasks, newest first
router.get('/', async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json(tasks);
});

// POST /api/tasks — create a task for the current user
router.post('/', async (req, res) => {
  const { title, description, priority } = req.body;
  if (!title || !String(title).trim()) {
    return res.status(400).json({ message: 'Task title is required.' });
  }
  const task = await Task.create({
    title:       String(title).trim(),
    description: description ? String(description).trim() : '',
    priority:    ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
    userId:      req.user.id,
  });
  res.status(201).json(task);
});

// PUT /api/tasks/:id — update fields on a task the current user owns
router.put('/:id', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });

  const { title, description, status, priority } = req.body;
  if (title !== undefined)       task.title       = String(title).trim();
  if (description !== undefined) task.description = String(description).trim();
  if (['todo', 'in-progress', 'done'].includes(status))   task.status   = status;
  if (['low', 'medium', 'high'].includes(priority))        task.priority = priority;

  await task.save();
  res.json(task);
});

// DELETE /api/tasks/:id — delete a task the current user owns
router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ message: 'Task deleted.' });
});

module.exports = router;
