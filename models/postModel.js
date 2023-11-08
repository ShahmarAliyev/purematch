const { Sequelize, Model, DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('./sequelizeConfig');
const User = require('./userModel');
const Post = sequelize.define(
  'Post',
  {
    postId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);

User.hasMany(Post, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
Post.belongsTo(User);
(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = Post;
