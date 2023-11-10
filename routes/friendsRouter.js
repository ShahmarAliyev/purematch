const express = require('express');
const friendsController = require('../controllers/friendsController');
const authController = require('../controllers/authController');
const friendsRouter = express.Router();

friendsRouter.post(
  '/add',
  authController.authenticate,
  friendsController.addFriend,
  (req, res) => {
    const { addedFriend } = res.locals;
    res.status(200).json(addedFriend);
  }
);

friendsRouter.post(
  '/friendList',
  authController.authenticate,
  friendsController.friendList,
  (req, res) => {
    res.status(200).json(res.locals.friendList);
  }
);
module.exports = friendsRouter;
