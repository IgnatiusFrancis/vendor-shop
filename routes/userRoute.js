const express = require("express");
const {
  createUser,
  activateAccount,
  Login,
  getUserById,
  logOut,
} = require("../controller/user");
const { uploads } = require("../multer");
const isAuthenticated = require("../middleware/auth");

const router = express.Router();

router.post("/create-user", uploads.single("avatar"), createUser);
router.post("/activation", activateAccount);
router.post("/login", Login);
router.get("/findme", isAuthenticated, getUserById);
router.get("/logout", isAuthenticated, logOut);

module.exports = router;
