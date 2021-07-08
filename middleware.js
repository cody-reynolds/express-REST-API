'use strict';
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const {User} = require('./models');

// This function is borrowed and slightly modified from the example authentication function in 
// Team Treehouse's "REST API Authentication with Express" workshop.

exports.authenticateUser = async (req, res, next) => {
    //Initializes a message variable in the event that authentication fails.    
    let message;

    // Parses the user's credentials from the Authorization header.
    const credentials = auth(req);

    // If the user's credentials are available, attempts to retrieve user from database
    // by their email address (the key from the Authorization header)
    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.username}});

        // If a user was successfully retrieved, uses bcryptjs to compare user's password
        // to user's password that was retrieved.
        if (user) {
            const authenticated = bcrypt
                .compareSync(credentials.password, user.password);
            // If the passwords match, stores the retrieved user object on the request object
            // so subsequent middleware has access to it
            if (authenticated) {
                console.log(`Authentication successful for email address: ${user.emailAddress}`);
                req.currentUser = user;
            } else { // Password matching failed
                message = `Authentication failure for email address: ${user.emailAddress}`;
            }
        } else { // User wasn't found in the database for the email in the request object
            message = `User not found for email address: ${credentials.username}`;
        }
    } else { // No authentication header was found in the HTTP request
        message = 'Auth header not found';
    }

// If user authentication fails
if (message) {
    console.warn(message);
    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied'});
}

// If user authentication succeeds
    next();
};