const expressAsyncHandler = require("express-async-handler");

const obtainToken = require("../utils/obtainToken");
const { verifyJwtToken } = require("../utils/verifyToken");

const isAuthenticated = expressAsyncHandler(async (req, res, next) => {
  const userDecoded = await verifyJwtToken(obtainToken(req));
  req.user = userDecoded;

  if (!userDecoded) {
    return res.status(401).json({
      status: "failed",
      message: "Kindly login, it seems the token is either expired or invalid",
    });
  }
  next();
});

module.exports = isAuthenticated;
