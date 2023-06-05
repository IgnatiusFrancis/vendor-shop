const jwt = require("jsonwebtoken");

const verifyToken = async (token) => {
  return await jwt.verify(
    token,
    process.env.ACTIVATION_SECRET,
    (error, decoded) => {
      if (error) {
        return false;
      } else {
        return decoded;
      }
    }
  );
};

module.exports = { verifyToken };
