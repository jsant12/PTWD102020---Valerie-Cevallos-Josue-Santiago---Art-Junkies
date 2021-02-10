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
  // if(!req.session.currentUser) {
  //   res.redirect('/auth/login');
  // }
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
    res.render('gallery-new');
  })

router.post('/gallery-new', (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
    const { galleryTitle, galleryDescription, galleryTheme } = req.body;
    console.log(req.body);
    Gallery.create({ galleryTitle, galleryDescription, galleryTheme, author: req.session.currentUser._id })
    .then(() => {
      res.redirect('/profile');
    })
    .catch((err) => console.log('Error creating new Gallery: ', err))
  });

//***********EDIT/UPDATE GALLERY***********/
//render edit page
  router.get('/gallery-edit/:galleryId', (req, res, next) => {
    if(!req.session.currentUser) {
      res.redirect('/gallery');
    }
    Gallery.findById(req.params.galleryId)
    .then((galleryFromDB) => {
      // Artwork.find().then((allArtwork) => {
      //   allArtwork.forEach((singleArtwork) => {
      //     galleryFromDB.image.forEach((onePieceOfArt) => {
      //       if(singleArtwork._id.equals(onePieceOfArt)) {
      //         singleArtwork.isInGallery = true;
      //       }
      //     })
      //   })
      // })
      res.render('gallery-edit', { galleryFromDB })
    })
    .catch((err) => console.log('error retrieving the Gallery', err))
  })

//post edits to DB  
  router.post('/gallery-edit/:galleryId', (req, res, next) => {
    if(!req.session.currentUser) {
      res.redirect('/auth/login');
    }

    const { galleryTitle, galleryDescription, galleryTheme } = req.body
    Gallery.findByIdAndUpdate(req.params.galleryId, { galleryTitle, galleryDescription, galleryTheme }, {new: true})
    .then((updatedGallery) => {
      console.log('******updated', updatedGallery)
      res.redirect('/profile')
    })
    .catch((err) => console.log('error Editing the Gallery', err))
  })

  //***********DELETE GALLERY***********/
  router.post('/gallery-delete/:galleryId', (req, res, next) => {
    Gallery.findByIdAndRemove(req.params.galleryId)
    .then(() => res.redirect('/profile'))
    .catch((err) => console.log('Error deleting the gallery', err))
  });

  module.exports = router;