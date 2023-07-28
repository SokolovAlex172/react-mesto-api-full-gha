/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    link: {
      type: String,
      required: [true, 'Поле "link" должно быть заполнено'],
      validate: {
        validator: (url) => validator.isURL(url),
        message: 'Неверный URL',
      },
    },
    owner: {
      type: mongoose.ObjectId,
      ref: 'user',
      required: [true, 'Поле "owner" должно быть заполнено'],
    },
    likes: {
      type: [mongoose.ObjectId],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

const Card = mongoose.model('card', cardSchema);
module.exports = Card;
