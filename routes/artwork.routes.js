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

//*************** UPLOAD ***************//
//****CREATE****//
router.get("/artwork-new", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  Artwork.find({ artist: req.session.currentUser}) 
  .then((artworkFromDB) => {
    res.render('artwork-new', { artworkFromDB })
  })
  // console.log(galleryFromDB)
  .catch((err) => console.log('Error, ', err))
    
  // res.render('artwork');
});


router.post("/artwork-new", fileUploader.single("imageToUpload"), (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  console.log(req.file);
  console.log("------> ", req.body);

  
  const { artist = (req.session.currentUser._id), title, medium, description, image } = req.body;

  Artwork.create({ artist, title, medium, description, image: req.file.path })
    .then((newArtwork) => {
      res.redirect("/artwork");
    })
    .catch((err) => console.log("Error while creating artwork: ", err));
});

//****UPDATE****//
router.get("/artwork-edit/:artworkId", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  Artwork.findById(req.params.artworkId) 
  .then((artworkFromDB) => {
    // console.log(galleryFromDB)
    res.render('artwork-edit', { artworkFromDB })
  })
  
  .catch((err) => console.log('Error, ', err))
    
  // res.render('artwork');
});

router.post("/artwork-edit/:artworkId", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  const{ title, description }=req.body;
  Artwork.findByIdAndUpdate(req.params.artworkId,{ title, description },{new:true})
  .then((updatedArtFromDB) => {
    console.log("---------------",{updatedArtFromDB});
    
    res.redirect('/artwork');
  })
  .catch((err) => console.log("Error updating artwork: ", err));
});


router.get("/artwork", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  Artwork.find({ artist: req.session.currentUser}) 
  .then((artworkFromDB) => {
    res.render('artwork', { artworkFromDB })
  })
  // console.log(galleryFromDB)
  .catch((err) => console.log('Error, ', err))
    
  // res.render('artwork');
});
router.post('/artwork-delete/:artworkId', (req, res, next) => {
    Artwork.findByIdAndRemove(req.params.artworkId)
    .then(() => res.redirect('/artwork'))
    .catch((err) => console.log('Error deleting artwork', err))
  });
  
module.exports = router;