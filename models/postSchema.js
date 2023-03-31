const { DataTypes, Model } = require('sequelize');
const sequelize = require('../sqlConfig')

class Post extends Model {}

Post.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Post'
});

module.exports = Post