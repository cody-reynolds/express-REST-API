'use strict';
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {};
  Course.init({
      title: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
                msg: "Title is required"
            },
            notEmpty: {
                msg: "Please enter a course title"
            }
          }
      },
      description: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notNull: {
                msg: "Description is required"
            },
            notEmpty: {
                msg: "Please enter a course description"
            }
          },
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

  //Creates the one to one relationship from Courses to Users (course owners)
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user', //alias to prevent capitalization issues
      foreignKey: {
        fieldName: 'userId',
        allowNull: true,
      },
    });
  };
      return Course;
  };