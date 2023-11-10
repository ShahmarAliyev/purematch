const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');

const friendsController = {};

friendsController.addFriend = async (req, res, next) => {
  console.log('friendsController.addFriend');
  const userId = res.locals.userId;
  const friendEmail = req.body.friendEmail;

  try {
    const user = await UserModel.findByPk(userId);
    const friend = await UserModel.findOne({ where: { email: friendEmail } });
    const userPosts = await PostModel.findAll({ where: { UserId: userId } });
    const friendPosts = await PostModel.findAll({
      where: { UserId: friend.id },
    });
    if (!friend) {
      return res.status(404).json({ error: 'Could not find the friend ' });
    }
    const userInFriends = {
      friendName: user.name,
      friendEmail: user.email,
      friendPosts: userPosts,
    };
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

    const [finalUser, finalFriend] = await Promise.all([
      updatedUser,
      updatedFriend,
    ]);
    if (!finalUser || !finalFriend) {
      return res
        .status(400)
        .json({ error: 'Something went wrong while adding friend' });
    }
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
  console.log('friendsController.friendList controller');
  const userId = res.locals.userId;
  try {
    const user = await UserModel.findByPk(userId);
    const friendList = user.friendList;
    const adjustedFriendList = [];
    for (const friend of friendList) {
      const friendEmail = friend.friendEmail;
      const foundFriend = await UserModel.findOne({
        where: { email: friendEmail },
      });
      if (foundFriend) {
        const friendsFriendList = foundFriend.friendList;
        const mutualFriends = friendsFriendList.filter((f) =>
          friendList.some((fr) => fr.friendEmail === f.friendEmail)
        );

        friend.mutualFriends = mutualFriends.length;
        adjustedFriendList.push(friend);
      }
    }
    res.locals.friendList = adjustedFriendList;
    console.log('friendList', adjustedFriendList);
  } catch (error) {
    console.log(error.message);
  }

  return next();
};

module.exports = friendsController;
