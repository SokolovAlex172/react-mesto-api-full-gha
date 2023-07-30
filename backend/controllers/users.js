/* eslint-disable linebreak-style */
const mongooseError = require('mongoose').Error;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found');
const Conflict = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

const getUser = (id, res, next) => {
  User.findById(id)
    .orFail(() => next(new NotFound('Не найдено')))
    .then((users) => res.send(users))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные'));
      } return next(error);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(201).send({
        name, about, avatar, email, _id: user._id,
      }))
      .catch((error) => {
        if (error.code === 11000) {
          next(new Conflict('Пользователь уже существует'));
          return;
        }
        if (error instanceof mongooseError.ValidationError) {
          next(new BadRequest('Некорректные данные'));
          return;
        }
        next(error);
      }));
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
    .then((user) => res.send(user))
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
    .then((user) => res.send(user))
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
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
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
