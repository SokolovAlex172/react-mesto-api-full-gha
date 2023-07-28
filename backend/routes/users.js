/* eslint-disable linebreak-style */
const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const urlCheckPattern = /https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?/;

const {
  getAllUsers,
  getUser,
  getUserInfo,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);

// Пользователь
router.get('/me', getUserInfo);

// Пользователь по id
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlCheckPattern),
  }),
}), updateUserAvatar);

module.exports = router;
