const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUpdateUser } = require("../middleware/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUser, updateUser);
module.exports = router;
