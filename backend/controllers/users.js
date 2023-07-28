/* eslint-disable linebreak-style */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found');
const Conflict = require('../errors/conflict');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User
      .create({
        name, about, avatar, email, password: hash,
      }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (error.code === 11000) {
        next(new Conflict('Пользователь уже существует'));
      } else {
        next(error);
      }
    });
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => next(new NotFound('Не найдено')))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      } return next(error);
    });
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(() => next(new NotFound('Пользователь c указанным id не найден')))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Передача некорректного id'));
      } else {
        next(error);
      }
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(() => next(new NotFound('Не найдено')))
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(error);
    });
};

const updateUserAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFound('Запрашиваемый пользователь по id не найден'); })
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  getUserInfo,
  updateUser,
  updateUserAvatar,
  login,
};
