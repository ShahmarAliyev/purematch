const jwt = require('jsonwebtoken');

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

const createJWTToken = (id) => {
  console.log(jwtPrivateKey);
  return jwt.sign({ id }, jwtPrivateKey, {
    expiresIn: '1h',
  });
};

module.exports = { createJWTToken };
