const UserModel = require('../models/userModel');
const authController = {};

authController.register = async (req, res, next) => {
  //add data/request validation here,name, email, password are required fields
  const { name, email, password } = req.body;
  check(email).isEmail();
  console.log(name, email, password);
  try {
    const newUser = await UserModel.create({ name, email, password });
    res.locals.user = newUser;
  } catch (error) {
    return next({
      log: 'Express error handler caught authController.register middleware error',
      status: 409,
      message: { err: 'Could not create new user' },
    });
  }

  return next();
};

module.exports = authController;
