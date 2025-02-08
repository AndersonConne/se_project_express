const router = require('express').Router();
const { getClothingItems, createClothingItem, likeClothingItem, deleteClothingItem, unlikeClothingItem } = require('../controllers/clothingItems');

router.get('/', getClothingItems);
router.post('/', createClothingItem);
router.put('/:itemId/likes', likeClothingItem);
router.delete('/:itemId', deleteClothingItem);
router.delete('/:itemId/likes', unlikeClothingItem);

module.exports = router;