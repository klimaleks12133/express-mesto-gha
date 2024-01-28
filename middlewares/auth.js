const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req.cookies) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  if (!req.cookies.jwt) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, 'dev-secret');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};