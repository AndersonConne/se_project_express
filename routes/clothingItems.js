const router = require('express').Router();
const { getClothingItems, createClothingItem, likeClothingItem, deleteClothingItem } = require('../controllers/clothingItems');

router.get('/', getClothingItems);
router.post('/', createClothingItem);
router.put('/:itemId/likes', likeClothingItem);
router.delete('/:itemId', deleteClothingItem);
router.delete('/:itemId/likes', deleteClothingItem);

module.exports = router;