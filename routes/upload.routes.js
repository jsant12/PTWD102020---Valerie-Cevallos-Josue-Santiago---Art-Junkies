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
    res.render('upload');
});

//****CREATE****//
router.post("/upload", fileUploader.single("imageToUpload"), (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  console.log("do i have it: ", req.file);
  console.log("------> ", req.body);

  
  const { artist = (req.session.currentUser._id), title, medium, description, image } = req.body;

  Artwork.create({ artist, title, medium, description, image: req.file.path })
    .then((newUpload) => {
      res.redirect("/upload");
    })
    .catch((err) => console.log("Error while creating artwork: ", err));
});

//****UPDATE****//


module.exports = router;