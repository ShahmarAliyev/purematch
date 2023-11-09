const express = require('express');
const authController = require('../controllers/authController');
const authRouter = express.Router();

authRouter.post('/register', authController.register, (req, res) => {
  res.status(201).json(res.locals.user);
});

authRouter.post('/login', authController.login, (req, res) => {
  res.status(200).json(res.locals.user);
});
module.exports = authRouter;
