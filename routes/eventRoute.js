const express = require("express");
const { uploads } = require("../multer");
const isAuthenticated = require("../middleware/auth");

const {
  createEvent,
  getAllEvents,
  deleteEvent,
} = require("../controller/event");

const router = express.Router();

router.post(
  "/create-event",
  isAuthenticated,
  uploads.array("images"),
  createEvent
);
router.get("/get-all-events/:id", isAuthenticated, getAllEvents);
router.get("/delete-shop-event/:id", isAuthenticated, deleteEvent);

module.exports = router;
