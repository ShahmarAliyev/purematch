const PostModel = require('../models/postModel');
const uploadFile = require('../utils/aws-s3');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const postController = {};

postController.createPost = async (req, res, next) => {
  const file = req.file;
  if (file === undefined) {
    return res.status(400).json('An image file is required to create a post');
  }
  if (file.mimetype !== 'image/jpeg') {
    return res.status(415).json('Supported file type is image/jpeg');
  }
  const { desc } = req.body;
  if (desc === undefined || desc.length === 0) {
    return res.status(400).json('Post needs a description');
  }
  const userId = res.locals.userId;
  try {
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    const newPost = await PostModel.create({
      description: desc,
      photo: result.Location,
      UserId: userId,
    });
    const { postId, description, photo, createdAt } = newPost;
    res.locals.post = { postId, description, photo, createdAt };
  } catch (error) {
    return next({
      log:
        'Express error handler caught postController.createPost middleware error' +
        error.message,
      status: 500,
      message: { err: 'Something went wrong while creating post' },
    });
  }
  return next();
};

module.exports = postController;
