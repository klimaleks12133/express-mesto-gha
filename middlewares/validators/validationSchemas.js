const { Joi } = require('celebrate');

module.exports = {
  signup: {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().pattern(/(http|https):\/\/([\w.]+\/?)\S*/),
    }),
  },
  signin: {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  },
  updateProfile: {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().pattern(/(http|https):\/\/([\w.]+\/?)\S*/),
    }),
  },
  updateAvatar: {
    body: Joi.object().keys({
      avatar: Joi.string().required().uri(),
    }),
  },
  createCard: {
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri(),
    }),
  },
};