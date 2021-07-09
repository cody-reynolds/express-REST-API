# Express REST API

**Synopsis**
\
This application is a REST API built with Express, SQLite, and Sequelize that performs CRUD operations on a catalog of school courses and related users. 

The API comes with a few features built in. User authentication is performed for a number of operations, including GET on the current user, and POST/PUT/DELETE requests on courses.

On user creation and authentication, passwords are hashed and synced respectively using the bcryptjs library.

Even if authentication is successful, only the course owner (the associated User identified in the Course's userId field) is allowed to perform PUT or DELETE operations on courses.

**Motivation**
\
This project is the back-end component to a full-stack JavaScript application that uses React on the front end. I built this project to gain some experience building a REST API from scratch, and specifically to practice a few key concepts:

- Sequelize model creation and model associations
- Database-side validation (notNull, notEmpty, unique, valid email)
- User authentication and password hashing
- Sending the correct HTTP status codes
- Express routing, where the end result is JSON or just an HTTP status instead of rendering views
- Selectively returning table attributes / hiding sensitive data like passwords or irrelevant data like timestamps 

**Installation**
\
After installing the project's dependencies with `npm install`, you can start it up with `npm start`. The application will run on localhost:5000.

There is also a Postman collection included that will enable to you to perform a set of test requests.

At any point, if you need to reset the database data for testing purposes, you can do so by running `npm run seed` in the terminal.


\
This project was created as part of the [Treehouse Full Stack JavaScript Techdegree](https://teamtreehouse.com/techdegree/full-stack-javascript).