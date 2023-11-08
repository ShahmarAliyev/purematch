const express = require('express');
const authController = require('../controllers/authController');
const authRouter = express.Router();
const { check, validationResult } = require('express-validator');

authRouter.post(
  '/register',
  [
    check('name').notEmpty().isLength({ min: 5, max: 30 }),
    check('password').notEmpty().isLength({ min: 5, max: 50 }),
    check('email').notEmpty().isEmail(),
  ],
  authController.register,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.status(201).json(res.locals.user);
  }
);

authRouter.post(
  '/login',
  [
    check('password').notEmpty().isLength({ min: 5, max: 50 }),
    check('email').notEmpty().isEmail(),
  ],
  authController.login,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).json(res.locals.user);
  }
);
module.exports = authRouter;
