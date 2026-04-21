require('dotenv').config();
const { createLogger, format, transports } = require('winston');
const { MongoDB } = require('winston-mongodb');

const { combine, timestamp, printf, colorize, errors } = format;

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) =>
    stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`
  )
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new transports.Console({ format: consoleFormat }),
    new MongoDB({
      db: process.env.MONGO_URI,
      collection: 'logs',
      level: 'info',
      // Store full metadata (route, userId, etc.) when passed as second arg
      options: {},
      format: combine(
        timestamp(),
        errors({ stack: true }),
        format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
      ),
    }),
  ],
});

module.exports = logger;
