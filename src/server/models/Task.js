const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      required:  [true, 'Task title is required.'],
      trim:      true,
      maxlength: [200, 'Title must be 200 characters or fewer.'],
    },
    description: {
      type:      String,
      trim:      true,
      default:   '',
      maxlength: [2000, 'Description must be 2000 characters or fewer.'],
    },
    status: {
      type:    String,
      enum:    ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: {
      type:    String,
      enum:    ['low', 'medium', 'high'],
      default: 'medium',
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Fast lookup of a user's tasks sorted newest-first
taskSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
