const UserModel = require('../models/userModel');
const authController = {};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createJWTToken } = require('../utils/jwtToken');

authController.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json('Missing or Invalid fields');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json('Wrong email format');
  }
  try {
    //check if user exist with same email
    const dbUser = await UserModel.findOne({ where: { email } });
    if (dbUser) {
      return res.status(409).json('User with this email already exists');
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });
      res.locals.user = { name: newUser.name, email: newUser.email };
      return next();
    }
  } catch (error) {
    return next({
      log:
        'Express error handler caught authController.register middleware error. Error: ' +
        err.message,
      status: 500,
      message: { err: 'Something went wrong while creating new user' },
    });
  }
};
authController.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json('Wrong email format');
  }
  try {
    const foundUser = await UserModel.findOne({ where: { email } });
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
    return next({
      log: 'Express error handler caught authController.login middleware error',
      status: 500,
      message: 'Something went wrong while logging in the user',
    });
  }
  return next();
};
authController.authenticate = async (req, res, next) => {
  const jwtToken = req.cookies.jwt;
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

  if (jwtToken) {
    try {
      const decodedToken = jwt.verify(jwtToken, jwtPrivateKey);
      const dbUser = await UserModel.findByPk(decodedToken.id);
      if (dbUser) {
        res.locals.userId = dbUser.id;
        return next();
      } else {
        // User not found in the database
        return next({
          log: 'Express error handler caught authController.authenticate middleware error',
          status: 401,
          message: { err: 'Could not find the user in the database' },
        });
      }
    } catch (error) {
      return next({
        log: 'Express error handler caught authController.authenticate middleware error',
        status: 500,
        message: { err: 'Something went wrong while authenticating user' },
      });
    }
  } else {
    //no token sent with cookies
    return next({
      log: 'Express error handler caught authController.authenticate middleware error',
      status: 401,
      message: { err: 'Could not find the authentication token' },
    });
  }
};

module.exports = authController;
