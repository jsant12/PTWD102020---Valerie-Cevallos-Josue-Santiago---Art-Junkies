const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

//Model imports
const Gallery = require('../models/Gallery.model')
const User = require('../models/User.model');
const Artwork = require('../models/Artwork.model');

//required for file upload to Cloudinary
const fileUploader = require("../configs/cloudinary.config");

//*************** GALLERY ***************//
// const validImages = gallery.images.filter(image => image !== undefined)

router.get("/gallery", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  Gallery.find() 
  .then((galleryFromDB) => {
    res.render('gallery', { galleryFromDB })
  })
  // console.log(galleryFromDB)
  .catch((err) => console.log('Error, ', err))
  
  // console.log('===========>', req.session.currentUser._id);
  // const { galleryTitle, galleryDescription, galleryTheme } = req.body;
  // console.log(req.body);
  // res.render('gallery', { galleryTitle, galleryDescription, galleryTheme })

});


router.get('/gallery-new', (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
    res.render('gallery-new', {userInSession: req.session.currentUser});
  })

router.post('/gallery-new', (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
    const { galleryTitle, galleryDescription, galleryTheme } = req.body;
    console.log(req.body);
    Gallery.create({ galleryTitle, galleryDescription, galleryTheme, author: req.session.currentUser._id })
    .then(() => {
      res.redirect('/gallery');
    })
    .catch((err) => console.log('Error creating new Gallery: ', err))
  });

  module.exports = router;