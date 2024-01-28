const router = require('express').Router();
const { celebrate } = require('celebrate');
const validationSchemas = require('../middlewares/validators/validationSchemas');

const {
  getUsers,
  getUserInfo,
  getUserById,
  updateUserInfo,
  updateUserAvatar
} = require('../controllers/users');
router.get('/users', getUsers);
router.get('/users/me', getUserInfo);
router.get('/users/:userId', getUserById);
router.patch('/users/me', celebrate(validationSchemas.updateProfile), updateUserInfo);
router.patch('/users/me/avatar', celebrate(validationSchemas.updateAvatar), updateUserAvatar);

module.exports = router;
