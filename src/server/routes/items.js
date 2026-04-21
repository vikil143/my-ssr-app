const express        = require('express');
const requireAuth    = require('../middleware/auth');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.get('/',  itemController.getItems);
router.post('/', requireAuth, itemController.createItem);

module.exports = router;
