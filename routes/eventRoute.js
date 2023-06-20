const express = require("express");
const { uploads } = require("../multer");
const isAuthenticated = require("../middleware/auth");

const { createEvent } = require("../controller/event");

const router = express.Router();

router.post("/create-event", uploads.array("images"), createEvent);

module.exports = router;
