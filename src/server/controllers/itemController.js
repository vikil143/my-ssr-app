const Item = require('../models/Item');

exports.getItems = async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.createItem = async (req, res, next) => {
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
};
