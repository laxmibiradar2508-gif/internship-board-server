const rateLimit = require('express-rate-limit');

const applicationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', errors: [{ message: 'Too many requests, try again shortly.' }] }
});

module.exports = { applicationLimiter };