const express = require('express');
const authController = require('../controllers/authController');
const authRouter = express.Router();

authRouter.post('/register', authController.register, (req, res) => {
  res.status(201).json('User Created');
});

module.exports = authRouter;
