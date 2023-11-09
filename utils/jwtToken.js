const jwt = require('jsonwebtoken');

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

const createJWTToken = (id) => {
  return jwt.sign({ id }, jwtPrivateKey, {
    expiresIn: '1h',
  });
};

module.exports = { createJWTToken };
