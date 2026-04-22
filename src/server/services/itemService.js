const Item = require('../models/Item');
const { httpError } = require('../utils/httpError');

async function listItems() {
  return Item.find().sort({ createdAt: -1 }).lean();
}

async function createItem({ name }) {
  const trimmed = String(name ?? '').trim();

  if (!trimmed) {
    throw httpError(400, 'Item name is required.');
  }

  return Item.create({ name: trimmed });
}

module.exports = {
  listItems,
  createItem,
};
