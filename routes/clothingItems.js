const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  likeClothingItem,
  deleteClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");
const {
  validateClothingItemBody,
  validateId,
} = require("../middleware/validation");

router.get("/", getClothingItems);
router.post("/", validateClothingItemBody, createClothingItem);
router.put("/:itemId/likes", validateId, likeClothingItem);
router.delete("/:itemId", validateId, deleteClothingItem);
router.delete("/:itemId/likes", validateId, unlikeClothingItem);

module.exports = router;
