'use strict';
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {};
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "First Name is required"
                },
                notEmpty: {
                    msg: "Please enter a first name"
                }
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Last Name is required"
                },
                notEmpty: {
                    msg: "Please enter a last name"
                }
            },
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "The email you entered already exists."
            },
            validate: {
                notNull: {
                    msg: "Email address is required"
                },
                notEmpty: {
                    msg: "Please provide an email address"
                },
                isEmail: {
                    msg: "Email address must be in a valid format (i.e. user@email.com)"
                }
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Password is required"
                },
                notEmpty: {
                    msg: "Please enter a password"
                }
            },
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