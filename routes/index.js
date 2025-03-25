const router = require("express").Router();
const userRouter = require("./users");
const ClothingItemRouter = require("./clothingItems");
const NotFoundError = require("../utils/errors/NotFoundError");
const auth = require("../middleware/auth");

router.use("/users", auth, userRouter);
router.use("/items", ClothingItemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("The requested resource was not found"));
});

module.exports = router;
