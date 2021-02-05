const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

//bcrypt import - handle password encryption
const bcryptjs = require('bcryptjs');

//userModel import
const User = require('../models/User.model');

//set saltRounds for password
const saltRounds = 10;

//routeGuard import
const routeGuard = require('../configs/route-guard.config');

//*************** REGISTER ***************/

router.get('/auth/register', (req, res, next) => {
  res.render('auth/register.hbs');
});

router.post('/register', (req, res, next) => {
  console.log(req.body)
  const { username, email, fname, lname, password } = req.body;

  if (!username || !email || !fname || !password) {
    res.render('auth/register.hbs', {
      errorMessage: 'All fields are required. Please enter in the requested information.'
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    res.render('auth/register.hbs', {
      errorMessage:
        'Password requirements: At least 8 characters, Needs to have at least one number, one lowercase and one uppercase letter.'
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        fname,
        lname,
        passwordHash: hashedPassword
      })
      
      .then((userFromDB) => {
        res.redirect("/profile");
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.render('auth/register.hbs', {
          errorMessage: 'Username and email need to be unique. Either username or email is already in use.'
        });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.render('auth/register.hbs', { errorMessage: err.message });
      } else {
        console.log('Error while creating a user: ', err);
      }
    });
});

//*************** LOGIN ***************/

//Login form for user input
router.get('/auth/login', (req, res, next) => {
  res.render('auth/login.hbs');
});

//Login form for user POST to DB
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.log(req.body);
    res.render('auth/login.hbs', {
      errorMessage: 'Login incorrect, please check your credentials and try again.'
    });
    return;
  }

//retrieve user from DB
  User.findOne({ username })
    .then((responseFromDB) => {

      if (!responseFromDB) {
        res.render('auth/login.hbs', { errorMessage: 'Username does not exist. Please try again.' });
      } else if (bcryptjs.compareSync(password, responseFromDB.passwordHash)) {

        req.session.currentUser = responseFromDB;

        res.redirect('/profile');
      } else {
        res.render('auth/login.hbs', { errorMessage: 'Incorrect password. Please try again.' });
      }
    })
    .catch((err) => console.log(`User login error: ${err}`));
});

//*************** LOGOUT ***************/

router.post('/logout', (req, res, next) => {
  req.session.destroy();

  res.redirect("/");
});

//*************** PROFILE ***************/

router.get("/profile", routeGuard, (req, res, next) => {
  res.render("profile.hbs");
});

module.exports = router;
