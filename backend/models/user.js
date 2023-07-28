/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const AuthorizedError = require('../errors/authorization-error');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (uri) => validator.isURL(uri),
        message: 'Неверный URL',
      },
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
      validate: {
        validator: (v) => isEmail(v),
        message: 'Неверный формат электронной почты',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function userByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizedError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
