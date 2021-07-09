'use strict';

//Import Express
const express = require ('express');

// Construct a router instance
const router = express.Router();

// Import database models
const User = require('./models').User;
const Course = require ('./models').Course;

// Import bcrypt to encrypt passwords
const bcrypt = require('bcryptjs');

// Imports user authentication function from the middleware file
const { authenticateUser } = require('./middleware');


// Handler function to wrap each route
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (error) {
        // Forward error to the global error handler
        next(error);
      }
    }
  }


/**
 * USER Routes
 */

// GET Route that returns the currently authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    //This route can access the user object on the request body thanks to the middleware.
    let user = req.currentUser;
    res.status(200).json(user);
}));


// POST Route that creates a new user
router.post('/users', asyncHandler(async (req, res) => {
    try{
        const user = req.body;
        if(user.password){user.password = await bcrypt.hash(user.password, 10);}
        await User.create(user);
        res.location = '/';
        res.status(201);
    } catch (error) {
        console.log('ERROR: ', error.name);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({errors});
        } else {
            throw error;
        }
    }
}));

//DELETE route that deletes a user
router.delete('/users/:id', asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id)
    await user.destroy();
    res.status(204).end();
}));

/**
 * COURSE Routes
 */

//GET Route that returns a list of courses
router.get('/courses', asyncHandler(async (req, res) => {
    let courses = await Course.findAll({
        include: [
            {
                model: User,
                as: 'user',
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt']
                }
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
    res.status(200).json(courses);
}));


//GET Route that returns a specific course
router.get('/courses/:id', asyncHandler(async (req, res) => {
    let course = await Course.findByPk(req.params.id, 
        {
        include: [
            {
                model: User,
                as: 'user',
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt']
                }
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })
    res.status(200).json(course);
}));


//PUT Route that updates a specific course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = req.body;
    const modifyingUser = req.body.userId;
    try {
        if(modifyingUser) {
            const courseBeingUpdated = await Course.findByPk(req.params.id);
            const courseOwner = courseBeingUpdated.userId;
             if(modifyingUser == courseOwner){
                 await Course.update(course, {where: { id: req.params.id}})
                res.status(204).end();
            } 
            else {
                res.status(403).end();
            }
        } else {
            res.status(403).end();
        }
    } catch (error) {
        console.log('ERROR: ', error.name);
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({errors});
        } else {
            throw error;
        }
    }
}));


//POST Route that creates a new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        await Course.create(req.body);
        res.location = '/';
        res.status(201).end();
    } catch (error) {
        console.log('ERROR: ', error.name);
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({errors});
        } else {
            throw error;
        }
    }
}));

//DELETE route that deletes a course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const modifyingUser = req.body.userId;
    if(modifyingUser) {
        const courseToDelete = await Course.findByPk(req.params.id);
        const courseOwner = courseToDelete.userId;
         if(modifyingUser == courseOwner){
            await courseToDelete.destroy();
            res.status(204).end();
        } 
        else {
            res.status(403).end();
        }
    } else {
        res.status(403).end();
    }
}));

module.exports = router;