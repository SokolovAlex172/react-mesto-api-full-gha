/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authorization-error');

const JWT_SECRET = 'super-strong-secret';

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};

module.exports = { auth };
