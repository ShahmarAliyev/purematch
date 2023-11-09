const PostModel = require('../models/postModel');
const uploadFile = require('../utils/aws-s3');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const moment = require('moment');

const postController = {};
postController.verifyFileCount = (req, res, next) => {
  if (req.files.length > 5) {
    return res.status(400).json('Up to 5 images allowed.');
  }
  return next();
};
postController.createPost = async (req, res, next) => {
  let uploadings = req.files;
  console.log(uploadings);
  uploadings.forEach((file) => {
    if (file === undefined) {
      return res.status(400).json('An image file is required to create a post');
    }
    if (file.mimetype !== 'image/jpeg') {
      return res.status(415).json('Supported file type is image/jpeg');
    }
  });
  const { desc } = req.body;
  if (desc === undefined || desc.length === 0) {
    return res.status(400).json('Post needs a description');
  }
  const userId = res.locals.userId;
  const photos = [];
  for (const file of uploadings) {
    try {
      const result = await uploadFile(file);
      await unlinkFile(file.path);
      photos.push(result.Location);
    } catch (error) {
      return next({
        log:
          'Express error handler caught postController.createPost middleware error' +
          error.message,
        status: 500,
        message: { err: 'Something went wrong while creating post' },
      });
    }
  }
  try {
    const newPost = await PostModel.create({
      description: desc,
      photo: photos,
      UserId: userId,
    });
    const { postId, description, photo, createdAt } = newPost;
    const relativeTime = moment(createdAt).fromNow();
    res.locals.post = { postId, description, photo, createdAt: relativeTime };
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
postController.updatePost = async (req, res, next) => {
  const UserId = res.locals.userId;
  const postID = req.params.postId;
  const postDesc = req.body.desc;
  if (!postID) {
    return res.status(400).json('Post id is required for update ');
  }
  if (!postDesc) {
    return res.status(400).json('Post description is required for update');
  }
  try {
    const oldPost = await PostModel.findOne({
      where: { UserId, postId: postID },
    });
    if (!oldPost) {
      return res.status(404).json('Could not find the post in database');
    }
    const updatedPost = await oldPost.update({ description: postDesc });

    const { postId, description, photo, createdAt } = updatedPost;
    const relativeTime = moment(createdAt).fromNow();
    res.locals.updatedPost = {
      postId,
      description,
      photo,
      createdAt: relativeTime,
    };
  } catch (error) {
    return next({
      log:
        'Express error handler caught postController.updatePost middleware error' +
        error.message,
      status: 500,
      message: { err: 'Something went wrong while updating post' },
    });
  }
  return next();
};

module.exports = postController;
