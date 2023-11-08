const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const postRouter = express.Router();

postRouter.post(
  '/',
  authController.authenticate,
  postController.createPost,
  (req, res) => {
    return res.status(200).json(res.locals.post);
  }
);

module.exports = postRouter;
