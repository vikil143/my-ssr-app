const mongoose = require('mongoose');
const logger   = require('./utils/logger');

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  logger.info('MongoDB connected');
};

module.exports = connect;