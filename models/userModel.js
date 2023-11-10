//imports
const { DataTypes } = require('sequelize');
const { sequelize } = require('./sequelizeConfig');

//user model schema
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    friendList: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [],
      allowNull: false,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);

//exports
module.exports = User;
