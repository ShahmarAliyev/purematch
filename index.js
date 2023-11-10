//library/package imports
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();

//local/module imports
const authRouter = require('./routes/authRouter');
const postRouter = require('./routes/postRouter');
const friendsRouter = require('./routes/friendsRouter');

//app setup
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//route handling
app.use('/post', postRouter);
app.use('/auth', authRouter);
app.use('/friends', friendsRouter);
app.get('/', (req, res) => {
  return res.status(200).json('Hello World');
});

//global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});
//server setup
const server = app.listen(3000 || process.env.BACKEND_PORT, () => {
  console.log('Server started on port ' + process.env.BACKEND_PORT);
});
