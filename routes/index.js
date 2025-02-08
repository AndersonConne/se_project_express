const router = require('express').Router();
const userRouter  = require('./users');
const ClothingItemRouter = require('./clothingItems');
const { INVALID_DATA } = require('../utils/errors');

router.use('/users', userRouter);
router.use('/items', ClothingItemRouter);

router.use((req, res) => {
  res.status(INVALID_DATA).send({ message: 'Incorrect Data.' });
});

module.exports = router;