const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');

const postController = {};

postController.createPost = async (req, res, next) => {
  //make routes so that the response is sent in last middleware function

  //validate req body
  const { description, photo } = req.body;
  const userId = res.locals.userId;
  try {
    const newPost = await PostModel.create({
      description,
      photo,
      UserId: userId,
    });
    res.locals.post = newPost;
  } catch (error) {
    return next({
      log: 'Express error handler caught postController.createPost middleware error',
      status: 500,
      message: { err: 'Internal server error while creating post' },
    });
  }
  return next();
};

module.exports = postController;
