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

router.get("/upload", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  Artwork.find({ artist: req.session.currentUser}) 
  .then((artworkFromDB) => {
    res.render('upload', { artworkFromDB })
  })
  // console.log(galleryFromDB)
  .catch((err) => console.log('Error, ', err))
    
  // res.render('upload');
});

//****CREATE****//
router.post("/upload", fileUploader.single("imageToUpload"), (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  console.log(req.file);
  console.log("------> ", req.body);

  
  const { artist = (req.session.currentUser._id), title, medium, description, image } = req.body;

  Artwork.create({ artist, title, medium, description, image: req.file.path })
    .then((newUpload) => {
      res.redirect("/upload");
    })
    .catch((err) => console.log("Error while creating artwork: ", err));
});

//****UPDATE****//
router.get("/upload-edit/:artworkId", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  Artwork.findById(req.params.artworkId) 
  .then((artworkFromDB) => {
    // console.log(galleryFromDB)
    res.render('upload-edit', { artworkFromDB })
  })
  
  .catch((err) => console.log('Error, ', err))
    
  // res.render('upload');
});

router.post("/upload-edit", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  Artwork.findByIdAndUpdate(req.session.currentUser._id, req.body,{new:true})
  .then((foundArtFromDB) => {
    console.log("---------------",{foundArtFromDB});
    
    res.redirect('/upload');
  })
  .catch((err) => console.log("Error pulling User ID: ", err));
});

module.exports = router;