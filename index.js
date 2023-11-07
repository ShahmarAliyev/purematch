const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const authRouter = require('./routes/authRouter');
const { dbConnection } = require('./models/sequelizeConfig');

//app setup
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/auth', authRouter);
app.get('/', (req, res) => {
  res.status(200).json('Hello World');
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
// dbConnection();
