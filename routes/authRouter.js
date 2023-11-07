const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const authRouter = express.Router();

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
module.exports = authRouter;
