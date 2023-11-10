const verify = {};

verify.verifyEmail = (email) => {
  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailFormat.test(email);
};
module.exports = { verifyEmail };
