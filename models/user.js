'use strict';
const {Model, DataTypes} = require('sequelize');

//Initializes variable for modifying the toJSON method below
const PROTECTED_ATTRIBUTES = ['password', 'createdAt', 'updatedAt']

module.exports = (sequelize) => {
    class User extends Model {
        // Instance method for hiding password and other fields we do not want to return
        // Special thanks to user Arivia on StackOverflow:
        // https://stackoverflow.com/questions/27972271/sequelize-dont-return-password
        toJSON () {
            let attributes = Object.assign({}, this.get())
            for (let a of PROTECTED_ATTRIBUTES) {
                delete attributes[a]
            }
            return attributes
        }
    };

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

    //Creates the one-to-many relationship between Users and Courses
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