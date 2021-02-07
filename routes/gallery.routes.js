const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

//Model imports
const User = require('../models/User.model');
const Artwork = require('../models/Artwork.model');

//*************** GALLERY ***************//
const validImages = gallery.images.filter(image => image !== undefined)

router.get("/gallery", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/gallery.hbs');
  }
  User.findById(req.session.currentUser._id)
  .then((foundUserFromDB) => {
    
    console.log(foundUserFromDB);
    res.render('gallery', {foundUserFromDB});
  })
  
  .catch((err) => console.log("Error pulling User ID: ", err));
});


router.post("/gallery:_id", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  User.findByIdAndUpdate(req.session.currentUser._id)
  .then((foundUserFromDB) => {
    
    console.log(foundUserFromDB);
    res.render('profile', {foundUserFromDB});
  })
  
  .catch((err) => cons