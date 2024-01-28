const router = require('express').Router();
const { celebrate } = require('celebrate');
const validationSchemas = require('../middlewares/validators/validationSchemas');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', celebrate(validationSchemas.createCard), createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);
module.exports = router;
