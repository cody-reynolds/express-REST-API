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
            allowNull: true,
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'User',
        });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'user', //alias
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };
        return User;
    };