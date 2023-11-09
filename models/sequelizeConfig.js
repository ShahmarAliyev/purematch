const { Sequelize } = require('sequelize');

const URL = process.env.POSTGRES_URI;

const sequelize = new Sequelize(URL, {
  logging: console.log,
});
async function dbConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
module.exports = { dbConnection, sequelize };
