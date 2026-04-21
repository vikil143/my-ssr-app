const express        = require('express');
const requireAuth    = require('../middleware/auth');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Every task route requires a valid JWT cookie
router.use(requireAuth);

router.get('/',       taskController.getTasks);
router.get('/:id',    taskController.getTask);
router.post('/',      taskController.createTask);
router.put('/:id',    taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
