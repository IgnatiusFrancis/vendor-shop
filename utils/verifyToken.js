const jwt = require("jsonwebtoken");

const verifytoken = (token) => {
  // console.log(`Ver ${token}`);
  return jwt.verify(token, process.env.ACTIVATION_SECRET, (error, decoded) => {
    if (error) {
      return false;
    } else {
      return decoded;
    }
  });
};

const verifyJwtToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
    if (error) {
      return false;
    } else {
      return decoded;
    }
  });
};

module.exports = { verifytoken, verifyJwtToken };
