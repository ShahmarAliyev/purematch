const express = require('express');
const app = express();
const authRouter = require('./routes/authRouter');
app.use(express.json());

//setup environement variables
const dotenv = require('dotenv').config();

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

const server = app.listen(3000 || process.env.BACKEND_PORT, () => {
  console.log('Server started on port ' + process.env.BACKEND_PORT);
});
