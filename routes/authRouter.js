//setup & imports
const express = require('express');
const authRouter = express.Router();

const authController = require('../controllers/authController');

//route endpoints
authRouter.post('/register', authController.register, (req, res) => {
  return res.status(201).json(res.locals.user);
});

authRouter.post('/login', authController.login, (req, res) => {
  return res.status(200).json(res.locals.user);
});

//exports
module.exports = authRouter;
