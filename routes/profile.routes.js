const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

//routeGuard import
const routeGuard = require('../configs/route-guard.config');

// Cloudinary Upload
const fileUploader = require("../configs/cloudinary.config");

//userModel import
const User = require('../models/User.model');
const Artwork = require('../models/Artwork.model');
const Gallery = require('../models/Gallery.model')

//*************** PROFILE ***************//

//****READ****//
router.get("/profile", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
 res.render('profile');
});

//****UPDATE****//
router.get("/profile-edit", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
    res.render('profile-edit');
});

router.post("/profile-edit", fileUploader.single("imageToUpload"),(req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  const { fname, lname, email } = req.body;

  User.findByIdAndUpdate(req.session.currentUser._id, { fname, lname, email },{new:true})
  .then((foundUserFromDB) => {
    req.session.currentUser = foundUserFromDB;
    console.log(req.body);
    res.redirect('/profile');
  })
  .catch((err) => console.log("Error pulling User ID: ", err));
});

router.post("/profile-picEdit", fileUploader.single("imageToUpload"),(req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  const { profilePicture } = req.body;

  User.findByIdAndUpdate(req.session.currentUser._id, { profilePicture: req.file.path },{new:true})
  .then((foundUserFromDB) => {
    req.session.currentUser = foundUserFromDB;
    console.log(req.body);
    res.redirect('/profile');
  })
  .catch((err) => console.log("Error pulling User ID: ", err));
});

//****DELETE****//
router.get("/profile-delete", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
    res.redirect('/');
});

router.post("/profile-delete", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  User.findByIdAndRemove(req.session.currentUser._id)
  .then((foundUserFromDB) => {
    req.session.currentUser = foundUserFromDB;
    console.log({foundUserFromDB});
    req.session.destroy();
    res.redirect('/');
  })
  .catch((err) => console.log("Error pulling User ID: ", err));
});

module.exports = router;