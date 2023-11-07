const UserModel = require('../models/userModel');
const authController = {};
const bcrypt = require('bcrypt');
const { createJWTToken } = require('../utils/jwtToken');

authController.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  //add logic to see if user is registered already
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.locals.user = { name: newUser.name, email: newUser.email };
    console.log(
      'newuser obj,',
      newUser,
      'new user name',
      newUser.name,
      'newuser email',
      newUser.email
    );
  } catch (error) {
    return next({
      //look at status codes
      log: 'Express error handler caught authController.register middleware error',
      status: 409,
      message: { err: 'Could not create new user' },
    });
  }

  return next();
};
authController.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const foundUser = await UserModel.findOne({ where: { email } });
    console.log('foundUser name', foundUser.name);
    if (foundUser === null) {
      return res.status(401).json('Wrong email or password');
    } else {
      const authorized = await bcrypt.compare(password, foundUser.password);
      if (authorized) {
        const jwtToken = createJWTToken(foundUser.id);
        res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: 3600 });
        res.locals.user = {
          name: foundUser.name,
          email: foundUser.email,
          jwtToken,
        };
      } else {
        return res.status(401).json('Wrong email or password');
      }
    }
  } catch (error) {
    console.log('before catch next');
    return next({
      log: 'Express error handler caught authController.login middleware error',
      status: 401,
      message: { err: 'Could not log in the user' },
    });
  }
  return next();
};

module.exports = authController;
