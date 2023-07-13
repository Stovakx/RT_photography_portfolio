const session = require('express-session');
const crypto = require('crypto');

const generateSessionSecret = () => {
  const sessionSecret = crypto.randomBytes(32).toString('hex');
  return sessionSecret;
};

const sessionSecret = generateSessionSecret();

const sessionMiddleware = session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
});

module.exports = generateSessionSecret;
