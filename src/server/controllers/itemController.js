const itemService = require('../services/itemService');

exports.getItems = async (req, res, next) => {
  try {
    const items = await itemService.listItems();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const item = await itemService.createItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};
