const mongoose = require('mongoose');
const Task = require('../models/Task');
const { httpError, mongooseValidationMessage } = require('../utils/httpError');

const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

function assertValidTaskId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(400, 'Invalid task ID.');
  }
}

function normalizeCreatePayload(payload) {
  const { title, description, priority } = payload;
  const trimmedTitle = String(title ?? '').trim();

  if (!trimmedTitle) {
    throw httpError(400, 'Task title is required.');
  }
  if (trimmedTitle.length > 200) {
    throw httpError(400, 'Title must be 200 characters or fewer.');
  }

  const trimmedDesc = String(description ?? '').trim();
  if (trimmedDesc.length > 2000) {
    throw httpError(400, 'Description must be 2000 characters or fewer.');
  }

  return {
    title: trimmedTitle,
    description: trimmedDesc,
    priority: VALID_PRIORITIES.includes(priority) ? priority : 'medium',
  };
}

function applyTaskUpdates(task, payload) {
  const { title, description, status, priority } = payload;

  if (title !== undefined) {
    const trimmedTitle = String(title).trim();
    if (!trimmedTitle) {
      throw httpError(400, 'Title cannot be empty.');
    }
    if (trimmedTitle.length > 200) {
      throw httpError(400, 'Title must be 200 characters or fewer.');
    }
    task.title = trimmedTitle;
  }

  if (description !== undefined) {
    const trimmedDesc = String(description).trim();
    if (trimmedDesc.length > 2000) {
      throw httpError(400, 'Description must be 2000 characters or fewer.');
    }
    task.description = trimmedDesc;
  }

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      throw httpError(400, `Status must be one of: ${VALID_STATUSES.join(', ')}.`);
    }
    task.status = status;
  }

  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(priority)) {
      throw httpError(400, `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
    }
    task.priority = priority;
  }
}

async function listTasks(userId, query = {}) {
  const filter = { userId };

  if (VALID_STATUSES.includes(query.status)) {
    filter.status = query.status;
  }
  if (VALID_PRIORITIES.includes(query.priority)) {
    filter.priority = query.priority;
  }

  return Task.find(filter).sort({ createdAt: -1 }).lean();
}

async function getTask(id, userId) {
  assertValidTaskId(id);

  const task = await Task.findOne({ _id: id, userId }).lean();
  if (!task) {
    throw httpError(404, 'Task not found.');
  }

  return task;
}

async function createTask(userId, payload) {
  try {
    return await Task.create({
      ...normalizeCreatePayload(payload),
      userId,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw httpError(400, mongooseValidationMessage(err));
    }
    throw err;
  }
}

async function updateTask(id, userId, payload) {
  assertValidTaskId(id);

  const task = await Task.findOne({ _id: id, userId });
  if (!task) {
    throw httpError(404, 'Task not found.');
  }

  applyTaskUpdates(task, payload);

  try {
    await task.save();
    return task;
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw httpError(400, mongooseValidationMessage(err));
    }
    throw err;
  }
}

async function deleteTask(id, userId) {
  assertValidTaskId(id);

  const task = await Task.findOneAndDelete({ _id: id, userId });
  if (!task) {
    throw httpError(404, 'Task not found.');
  }
}

module.exports = {
  VALID_PRIORITIES,
  VALID_STATUSES,
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
};
