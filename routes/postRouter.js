const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const postRouter = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

postRouter.post(
  '/',
  authController.authenticate,
  upload.single('img'),
  postController.createPost,
  (req, res) => {
    return res.status(200).json(res.locals.post);
  }
);

module.exports = postRouter;
