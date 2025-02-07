const router = require('express').Router();
const userRouter  = require('./users');
const ClothingItemRouter = require('./clothingItems');

router.use('/users', userRouter);
router.use('/items', ClothingItemRouter);

module.exports = router;