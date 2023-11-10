//setup & imports
const express = require('express');
const multer = require('multer');
const postRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

//route endpoints
postRouter.post(
  '/',
  authController.authenticate,
  upload.array('img'),
  postController.verifyFileCount,
  postController.createPost,
  (req, res) => {
    return res.status(200).json(res.locals.post);
  }
);
postRouter.put(
  '/:postId',
  authController.authenticate,
  postController.updatePost,
  (req, res) => {
    const { updatedPost } = res.locals;
    return res.status(200).json(updatedPost);
  }
);

postRouter.get(
  '/',
  authController.authenticate,
  postController.getPosts,
  (req, res) => {
    return res.status(200).json(res.locals.posts);
  }
);
//exports
module.exports = postRouter;
