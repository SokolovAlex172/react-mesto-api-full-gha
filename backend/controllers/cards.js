/* eslint-disable linebreak-style */
const Card = require('../models/cards');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found');
const Forbidden = require('../errors/forbidden');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      throw new NotFound(`Карточка с id: ${cardId} не найдена`);
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card).then(() => res.send(card));
      } else {
        throw new Forbidden('Удаление запрещено');
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest(`Передан некорректный id: ${cardId}`));
      } else if (error.name === 'NotFound') {
        next(new NotFound(`Карточка с id: ${cardId} не найдена`));
      } else {
        next(error);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound(`Карточка с id: ${cardId} не найдена`);
    })
    .then((card) => {
      res.status(201).send({ card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest(`Передан некорректный id: ${cardId}`));
      } else if (error.name === 'NotFound') {
        next(new NotFound(`Карточка с id: ${cardId} не найдена`));
      } else {
        next(error);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound(`Карточка с id: ${cardId} не найдена`);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(`Передан некорректный id: ${cardId}`));
      } else if (err.name === 'NotFound') {
        next(new NotFound(`Карточка с id: ${cardId} не найдена`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
