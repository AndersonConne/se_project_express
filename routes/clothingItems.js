const router = require('express').Router();
const { getClothingItems, createClothingItem, likeClothingItem, deleteClothingItem, unlikeClothingItem } = require('../controllers/clothingItems');
const auth = require("../middleware/auth");

router.get('/', getClothingItems);
router.post('/', auth, createClothingItem);
router.put('/:itemId/likes', auth, likeClothingItem);
router.delete('/:itemId', auth,  deleteClothingItem);
router.delete('/:itemId/likes', auth, unlikeClothingItem);

module.exports = router;