//setup & imports
const express = require('express');
const friendsRouter = express.Router();

const friendsController = require('../controllers/friendsController');
const authController = require('../controllers/authController');

//route endpoints
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

//exports
module.exports = friendsRouter;
