const Event = require("../model/eventModel");
const expressAsyncHandler = require("express-async-handler");
const Shop = require("../model/shopModel");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");

const createEvent = expressAsyncHandler(async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return next(new ErrorHandler("Shop Id is invalid", 400));
    } else {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);
      const productData = req.body;
      productData.images = imageUrls;
      productData.shop = shop;

      const event = await Event.create(productData);

      res.status(200).json({ status: true, event });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

const getAllEvents = expressAsyncHandler(async (req, res, next) => {
  try {
    const events = await Event.find({ shopId: req.params.id });

    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

const deleteEvent = expressAsyncHandler(async (req, res, next) => {
  try {
    const eventId = req.params.id;

    const eventData = await Event.findById(eventId);

    eventData.images.forEach((imageUrl) => {
      const filename = imageUrl;
      const filePath = `uploads/${filename}`;

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting File ", err);
        } else {
          console.log("File deleted Successfully");
        }
      });
    });

    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return next(new ErrorHandler("Event not found with this Id", 400));
    }
    res.status(201).json({
      success: true,
      message: "Event Deleted",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

module.exports = {
  createEvent,
  getAllEvents,
  deleteEvent,
};
