// const { ObjectId } = require('mongoose').Types;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const {
  STATUS_400,
  STATUS_404,
  STATUS_500,
  STATUS_401
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Error('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Error('Неправильные почта или пароль');
        }

        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

        res.cookie('jwt', token, {
          httpOnly: true,
          sameSite: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }).send({ message: 'Авторизация прошла успешно' });
      });
    })
    .catch((err) => {
      res.status(STATUS_401).send({ message: err.message });
    });
};

const getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(STATUS_404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(STATUS_400).send({ message: 'Некорректный запрос' });
      }
      return res.status(STATUS_500).send({ message: 'Ошибка сервера' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' }));
};

// const createUser = (req, res) => {
//   const { name, about, avatar } = req.body;
//   User.create({ name, about, avatar })
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res.status(STATUS_400).send({
//           message: 'Переданы некорректные данные при создании пользователя'
//         });
//         return;
//       }
//       res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
//     });
// };

const createUser = (req, res, next) => {
  // const createUser = (req, res) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(STATUS_401).send({ message: 'Пользователь с таким email уже существует' });
        return;
      }
      next(err);
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  // if (!ObjectId.isValid(userId)) {
  //   res.status(STATUS_400).send({ message: 'Переданы некорректные данные' });
  //   return;
  // }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(STATUS_404).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      }
      res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
    });
};
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(STATUS_404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
    });
};
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(STATUS_404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  login,
  getUserInfo,
  getUsers,
  createUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar
};