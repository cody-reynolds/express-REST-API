'use strict';
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {};
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'User',
        });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'user', //alias to prevent capitalization issues
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };
        return User;
    };