const authController = {};

authController.register = (req, res, next) => {
  console.log('register controller');
  return next();
};

module.exports = authController;
