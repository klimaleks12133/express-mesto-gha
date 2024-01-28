const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, errors } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { STATUS_500 } = require('./utils/constants');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/not-found-error');
const validationSchemas = require('./middlewares/validators/validationSchemas');

const port = process.env.PORT || 3000;
const url = 'mongodb://localhost:27017/mestodb';
mongoose.connect(url);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64116c098734342bc4a5389b',
//   };
//   next();
// });
app.use('/', auth, usersRoutes);
app.use('/', auth, cardsRoutes);

app.post('/signup', celebrate(validationSchemas.signin), createUser);
app.post('/signin', celebrate(validationSchemas.signin), login);

app.use('/*', (req, res) => {
  const error = new NotFoundError('Страница не найдена');
  res.status(error.status).send({ message: error.message });
});

app.use(errorHandler);

app.use(errors());

// app.use((error, req, res) => {
//   res
//     .status(error.status)
//     .send({
//       message: (error.status === STATUS_500)
//         ? 'На сервере произошла ошибка'
//         : error.message,
//     });
// });


app.listen(port);
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}...`);
// });
