'use strict';

//Import Express
const express = require ('express');

// Construct a router instance
const router = express.Router();

// Import database models
const User = require('./models').User;
const Course = require ('./models').Course;


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

// Route that returns a list of all users
router.get('/users', asyncHandler(async (req, res) => {
    let users = await User.findAll();
    res.status(200).json(users);
}));


// Route that creates a new user
router.post('/users', asyncHandler(async (req, res) => {
    try{
        await User.create(req.body);
        res.location = '/';
        res.status(201).end();
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
            }
        ]
    });
    res.status(200).json(courses);
}));


//GET Route that returns a specific course
router.get('/courses/:id', asyncHandler(async (req, res) => {
    let course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
                as: 'user',
            }
        ]
    });
    res.status(200).json(course);
}));


//PUT Route that updates a specific course
router.put('/courses/:id', asyncHandler(async (req, res) => {
    const course = req.body;
    try {
        await Course.update(course, {where: { id: req.params.id}})
        res.status(204).end();
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


//POST Route that creates a new course
router.post('/courses', asyncHandler(async (req, res) => {
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
router.delete('/courses/:id', asyncHandler(async (req, res) => {
    let course = await Course.findByPk(req.params.id);
    await Course.destroy(course);
    res.status(204).end();
}));

module.exports = router;