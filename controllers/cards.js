const Card = require('../models/card');
const {
  STATUS_403,
  STATUS_400,
  STATUS_404,
  STATUS_500
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' }));
};
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
    });
};

// const deleteCard = (req, res) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .then((card) => {
//       if (!card) {
//         res.status(STATUS_404).send({ message: 'Карточка с указанным _id не найдена' });
//         return;
//       }
//       res.send(card);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(STATUS_400).send({ message: 'Переданы некорректные данные карточки' });
//         return;
//       }
//       res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
//     });
// };

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(STATUS_404).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      if (card.owner.toString() !== req.user._id) {
        res.status(STATUS_403).send({ message: 'У пользователя нет прав для удаления этой карточки' });
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((deletedCard) => {
          res.send(deletedCard);
        })
        .catch(() => {
          res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные карточки' });
        return;
      }
      res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
    });
};

// /////////////////////////////////////////////////

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(STATUS_404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
    });
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(STATUS_404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(STATUS_400).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(STATUS_500).send({ message: 'На сервере произошла ошибка' });
    });
};
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};