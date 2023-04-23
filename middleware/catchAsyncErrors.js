module.exports = (theFunc) => (req, res, next) => {
  promise.resolve(theFunc(req, res, next)).catch(next);
};
