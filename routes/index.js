const router = require('express').Router();
const userRouter  = require('./users');
const ClothingItemRouter = require('./clothingItems');
const { NOT_FOUND_ERROR } = require('../utils/errors');

router.use('/users', userRouter);
router.use('/items', ClothingItemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Incorrect Data.' });
});

module.exports = router;