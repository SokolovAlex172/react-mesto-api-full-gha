/* eslint-disable linebreak-style */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const NotFound = require('./errors/not-found');

const app = express();
const { PORT = 3000 } = process.env;

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { validateSignIn, validateSignUp } = require('./middlewares/validation');
const errorHandler = require('./middlewares/error-handler');

mongoose.connect('mongodb://127.0.0.1:27017/mydb');

app.use(helmet());
app.use(bodyParser.json());

app.post('/signup', validateSignUp(), createUser);
app.post('/signin', validateSignIn(), login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => {
  next(new NotFound('Маршрут не найден'));
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
