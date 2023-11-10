const UserModel = require('../models/userModel');
const authController = {};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createJWTToken } = require('../utils/jwtToken');
const { verifyEmail } = require('../utils/verify');

authController.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  //input validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing or Invalid fields' });
  }
  if (!verifyEmail(email)) {
    return res.status(400).json({ error: 'Wrong email format' });
  }
  try {
    //check if user exist with same email
    const dbUser = await UserModel.findOne({ where: { email } });
    if (dbUser) {
      //user exists in database
      return res
        .status(409)
        .json({ error: 'User with this email already exists' });
    } else {
      //user do not exists in database
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
        error.message,
      status: 500,
      message: { error: 'Something went wrong while creating new user' },
    });
  }
};
authController.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!verifyEmail(email)) {
    return res.status(400).json({ error: 'Wrong email format' });
  }
  try {
    //check if user is in databse
    const foundUser = await UserModel.findOne({ where: { email } });
    if (foundUser === null) {
      //user has not registered yet
      return res.status(401).json({ error: 'Wrong email or password' });
    } else {
      //user found in db
      //check password with bcrypt
      const authorized = await bcrypt.compare(password, foundUser.password);
      if (authorized) {
        //set cookies with jwt token and pass user to the response
        const jwtToken = createJWTToken(foundUser.id);
        res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: 3600 });
        res.locals.user = {
          name: foundUser.name,
          email: foundUser.email,
          jwtToken,
        };
      } else {
        //wrong password
        return res.status(401).json({ error: 'Wrong email or password' });
      }
    }
  } catch (error) {
    return next({
      log:
        'Express error handler caught authController.login middleware error. Error: ' +
        error.message,
      status: 500,
      message: 'Something went wrong while logging in the user',
    });
  }
  return next();
};
authController.authenticate = async (req, res, next) => {
  const jwtToken = req.cookies.jwt;
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
  //cookie has jwt token
  if (jwtToken) {
    try {
      const decodedToken = jwt.verify(jwtToken, jwtPrivateKey);
      const dbUser = await UserModel.findByPk(decodedToken.id);
      if (dbUser) {
        //user exist in database with current jwt token-> authorized
        res.locals.userId = dbUser.id;
        return next();
      } else {
        // User not found in the database
        return next({
          log: 'Express error handler caught authController.authenticate middleware error',
          status: 401,
          message: { error: 'Could not authenticate the user with this token' },
        });
      }
    } catch (error) {
      return next({
        log:
          'Express error handler caught authController.authenticate middleware error. Error: ' +
          error.message,
        status: 500,
        message: { error: 'Something went wrong while authenticating user' },
      });
    }
  } else {
    //no token sent with cookies
    return next({
      log: 'Express error handler caught authController.authenticate middleware error.',
      status: 401,
      message: { error: 'Could not find the authentication token' },
    });
  }
};

module.exports = authController;
