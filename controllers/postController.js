const PostModel = require('../models/postModel');
const uploadFile = require('../utils/aws-s3');

const postController = {};

postController.createPost = async (req, res, next) => {
  //make routes so that the response is sent in last middleware function
  //validate req body
  const file = req.file;
  const { desc } = req.body;
  const userId = res.locals.userId;
  try {
    const result = await uploadFile(file);
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
      message: { err: 'Internal server error while creating post' },
    });
  }
  return next();
};

module.exports = postController;
