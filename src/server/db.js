const mongoose = require('mongoose');

const connect = async () => {
  await mongoose.connect('mongodb://localhost:27017/myapp');
  console.log('MongoDB connected');
};

module.exports = connect;