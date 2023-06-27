const obtainToken = (req) => {
  const headersDetails = req.headers;

  let token;
  if (headersDetails.cookie) {
    token = headersDetails?.cookie?.split("=")[1];
  } else {
    token = headersDetails["authorization"]?.split(" ")[1];
  }

  if (token !== undefined) {
    return token;
  } else {
    return {
      status: "error",
      message: "It seems there is no token attached to the header",
    };
  }
};

module.exports = obtainToken;
