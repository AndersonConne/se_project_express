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
const auth = require("../middleware/auth");

router.get("/", getClothingItems);
router.post("/", auth, validateClothingItemBody, createClothingItem);
router.put("/:itemId/likes", auth, validateId, likeClothingItem);
router.delete("/:itemId", auth, validateId, deleteClothingItem);
router.delete("/:itemId/likes", auth, validateId, unlikeClothingItem);

module.exports = router;
