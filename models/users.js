const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    pattern: {
      params: /(http|https):\/\/([\w.]+\/?)\S*/,
      message: 'Должен начинаться с http, https и соответствовать спецификации URL, проверьте правильность формата',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Неправильный формат email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
userSchema.set('versionKey', false);
module.exports = mongoose.model('user', userSchema);