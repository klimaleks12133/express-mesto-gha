const { isCelebrateError } = require('celebrate');
const {
  STATUS_400,
  STATUS_409,
  STATUS_500,
  STATUS_401
} = require('../utils/constants');

function errorHandler(err, req, res, next) {
  if (isCelebrateError(err)) {
    const errors = {};

    err.details.forEach((error) => {
      errors[error.context.key] = error.message;
    });

    res.status(STATUS_400).send({ message: 'Переданы некорректные данные', errors });
  } else {
    if (err.name === 'CastError') {
      return res.status(STATUS_400).send({ message: 'Переданы некорректные данные' });
    }

    if (err.code === 11000) {
      return res.status(STATUS_409).send({ message: 'Пользователь с таким email уже существует' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(STATUS_401).send({ message: 'Необходима авторизация' });
    }
    const { statusCode = STATUS_500, message } = err;

    return res.status(statusCode).send({ message: statusCode === STATUS_500 ? 'На сервере произошла ошибка' : message });

    //    res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
    // }
  }
  return next();
}

module.exports = errorHandler;