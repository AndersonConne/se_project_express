const router = require("express").Router();
const {
  getCurrentUser,
  updateUser,
  createUser,
} = require("../controllers/users");

router.get("/me", getCurrentUser);
router.post("/signup", createUser);
router.patch("/me", updateUser);
module.exports = router;
