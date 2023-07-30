/* eslint-disable linebreak-style */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const NotFound = require('./errors/not-found');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3001 } = process.env;

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { validateSignIn, validateSignUp } = require('./middlewares/validation');
const errorHandler = require('./middlewares/error-handler');

const allowedCors = [
  'http://sokolov172.nomoredomains.sbs',
  'https://sokolov172.nomoredomains.sbs',
  'localhost:3000',
  'http://localhost',
  'http://localhost:3001',
  'http://localhost:3000',
];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

mongoose.connect('mongodb://127.0.0.1:27017/mydb2');

app.use(helmet());
app.use(bodyParser.json());

app.use(requestLogger);

app.use(cors(corsOptions));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateSignIn(), login);
app.post('/signup', validateSignUp(), createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => {
  next(new NotFound('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
