const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');
const verify = require('../utils/verify');

const friendsController = {};

friendsController.addFriend = async (req, res, next) => {
  const userId = res.locals.userId;

  const friendEmail = req.body.friendEmail;
  if (!verify.verifyEmail(friendEmail)) {
    return res.status(400).json({ error: 'Wrong email format' });
  }
  try {
    const user = await UserModel.findByPk(userId);
    const friend = await UserModel.findOne({ where: { email: friendEmail } });
    if (!friend) {
      return res.status(404).json({ error: 'Could not find the friend ' });
    }
    const userPosts = await PostModel.findAll({ where: { UserId: userId } });
    const friendPosts = await PostModel.findAll({
      where: { UserId: friend.id },
    });

    //you as a friend in your friends friendList
    const userInFriends = {
      friendName: user.name,
      friendEmail: user.email,
      friendPosts: userPosts,
    };
    //your friend in your friendList
    const newFriend = {
      friendName: friend.name,
      friendEmail: friend.email,
      friendPosts,
    };
    const updatedUser = await user.update({
      friendList: [...user.friendList, newFriend],
    });
    const updatedFriend = await friend.update({
      friendList: [...friend.friendList, userInFriends],
    });
    // if there is error while addin you to your friend's friend list
    // adding your friend to your friend list returns error
    const [finalUser, finalFriend] = await Promise.all([
      updatedUser,
      updatedFriend,
    ]);
    if (!finalUser || !finalFriend) {
      return res
        .status(400)
        .json({ error: 'Something went wrong while adding friend' });
    }
    //passing the last added friend to response object
    res.locals.addedFriend =
      finalUser.friendList[finalUser.friendList.length - 1];
  } catch (error) {
    return next({
      log:
        'Express error handler caught friendsController.addFriend middleware error. Error: ' +
        error.message,
      status: 500,
      message: { error: 'Something went wrong while adding friend' },
    });
  }
  return next();
};
friendsController.friendList = async (req, res, next) => {
  const userId = res.locals.userId;
  try {
    const user = await UserModel.findByPk(userId);
    const friendList = user.friendList;
    const frienListInfo = [];
    for (const friend of friendList) {
      const friendEmail = friend.friendEmail;
      const foundFriend = await UserModel.findOne({
        where: { email: friendEmail },
      });
      if (foundFriend) {
        //calculate number mutual friends
        const friendsFriendList = foundFriend.friendList;
        const mutualFriends = friendsFriendList.filter((f) =>
          friendList.some((fr) => fr.friendEmail === f.friendEmail)
        );

        friend.mutualFriends = mutualFriends.length;
        frienListInfo.push(friend);
      }
    }
    res.locals.friendList = frienListInfo;
  } catch (error) {
    return next({
      log:
        'Express error handler caught friendsController.addFriend middleware error. Error: ' +
        error.message,
      status: 500,
      message: { error: 'Something went wrong while adding friend' },
    });
  }

  return next();
};

module.exports = friendsController;
