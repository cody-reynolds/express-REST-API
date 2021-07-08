'use strict';
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {};
  Course.init({
      title: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      description: {
          type: DataTypes.TEXT,
          allowNull: true,
      },
      estimatedTime: {
          type: DataTypes.STRING,
          allowNull: true,
      },
      materialsNeeded: {
          type: DataTypes.STRING,
          allowNull: true
      }
  }, {
      sequelize,
      modelName: 'Course',
      });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user', //alias to prevent capitalization issues
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };
      return Course;
  };