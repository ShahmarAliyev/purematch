//imports && setup
const fs = require('fs');
const path = require('path');
const util = require('util');
const PostModel = require('../models/postModel');
const moment = require('moment');
const unlinkFile = util.promisify(fs.unlink);
const uploadFile = require('../utils/aws-s3');

// controller functions
const postController = {};

postController.verifyFileCount = (req, res, next) => {
  if (req.files.length > 1) {
    //if users upload more than 5, all the uploadings gets deleted
    //then returns the error
    const directory = 'uploads';
    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), (error) => {
          if (error) {
            return next({
              log:
                'Express error handler caught postController.verifyFileCount middleware error. Error: ' +
                error.message,
              status: 500,
              message: { error: 'Something went wrong while creating post' },
            });
          }
        });
      }
    });
    return res.status(400).json({ error: 'Up to 5 images allowed.' });
  }
  return next();
};

postController.createPost = async (req, res, next) => {
  const uploadings = req.files;
  if (!uploadings) {
    return res
      .status(400)
      .json({ error: 'File or Files are required for a post' });
  }
  uploadings.forEach((file) => {
    if (file === undefined) {
      return res
        .status(400)
        .json({ error: 'An image file is required to create a post' });
    }
    if (file.mimetype !== 'image/jpeg') {
      return res
        .status(415)
        .json({ error: 'Supported file type is image/jpeg' });
    }
  });
  const { desc } = req.body;
  if (desc === undefined || desc.length === 0) {
    return res.status(400).json({ error: 'Post needs a description' });
  }
  const userId = res.locals.userId;
  const photos = [];
  for (const file of uploadings) {
    try {
      //for each file in uploads upload them s3 first
      const result = await uploadFile(file);
      if (!result) {
        return res
          .status(500)
          .json({ error: 'Something went wrong while uploading to S3 bucket' });
      }
      //once files are uploaded delete them from server
      await unlinkFile(file.path);
      //add the s3 url for the file to an array which will be value of photos in the newpost
      photos.push(result.Location);
    } catch (error) {
      return next({
        log:
          'Express error handler caught postController.createPost middleware error. Error: ' +
          error.message,
        status: 500,
        message: { error: 'Something went wrong while creating post' },
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
        'Express error handler caught postController.createPost middleware error. Error: ' +
        error.message,
      status: 500,
      message: { error: 'Something went wrong while creating post' },
    });
  }

  return next();
};

postController.updatePost = async (req, res, next) => {
  const UserId = res.locals.userId;
  const postID = req.params.postId;
  const postDesc = req.body.desc;
  if (!postID) {
    return res.status(400).json({ error: 'Post id is required for update ' });
  }
  if (!postDesc) {
    return res
      .status(400)
      .json({ error: 'Post description is required for update' });
  }
  try {
    const oldPost = await PostModel.findOne({
      where: { UserId, postId: postID },
    });
    if (!oldPost) {
      return res
        .status(404)
        .json({ error: 'Could not find the post in database' });
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
        'Express error handler caught postController.updatePost middleware error. Error: ' +
        error.message,
      status: 500,
      message: { error: 'Something went wrong while updating post' },
    });
  }
  return next();
};

postController.getPosts = async (req, res, next) => {
  const { page, limit } = req.query;
  if (page < 1) {
    return res
      .status(400)
      .json({ error: 'Page should be number that is greater than 0' });
  }
  if (limit < 1) {
    return res
      .status(400)
      .json('Limit should be number that is greater than 0');
  }
  const offset = (page - 1) * limit;
  const UserId = res.locals.userId;
  try {
    const posts = await PostModel.findAndCountAll({
      where: { UserId },
      offset,
      limit,
    });
    if (posts.count === 0) {
      //no posts found
      return res.status(404).json({ error: 'There is no post to show' });
    }
    if (posts.rows.length === 0) {
      //posts found but user is looking for wrong page
      const lastPage = Math.ceil(posts.count / limit);
      return res.status(404).json({
        error: `Page not found or Empty. The last page is ${lastPage}`,
      });
    }
    res.locals.posts = posts.rows;
  } catch (error) {
    return next({
      log:
        'Express error handler caught postController.getPosts middleware error. Error: ' +
        error.message,
      status: 500,
      message: { error: 'Something went fetching posts' },
    });
  }
  return next();
};

//exports
module.exports = postController;
