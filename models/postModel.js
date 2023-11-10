//imports
const { DataTypes } = require('sequelize');
const { sequelize } = require('./sequelizeConfig');
const User = require('./userModel');

//post model schema
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
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);

//associations
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

//exports
module.exports = Post;
