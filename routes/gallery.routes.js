const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

//Model imports
const Gallery = require('../models/Gallery.model')
const User = require('../models/User.model');
const Artwork = require('../models/Artwork.model');

//required for file upload to Cloudinary
const fileUploader = require("../configs/cloudinary.config");

//*************MASTER GALLERY LIST**************/
router.get('/gallery', (req, res, next) => {
  Gallery.find()
  .populate("author") 
  .then((allGalleriesfromDB) => {
      const sortedGalleries = allGalleriesfromDB.sort((a, b) => {
          return a.author - b.author
      });

    res.render("gallery", { allGalleriesfromDB: sortedGalleries });
  })
  .catch((err) => console.log('Error displaying the galleries', err));
});

//*****************CREATE GALLERY*************/

router.get('/gallery-new', (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }
  Artwork.find({artist: req.session.currentUser})
    .then((artworkFromDB) => {
      res.render("gallery-new", { artworkFromDB });
    })
    .catch((err) => console.log("Error displaying stuff", err));
    
  })

router.post('/gallery-new', (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/auth/login');
  }

    const { galleryTitle, galleryDescription, galleryTheme, image } = req.body;
    console.log(req.body);
    Gallery.create({ galleryTitle, galleryDescription, galleryTheme, image, author: req.session.currentUser._id })
    .then(() => {
      res.redirect('/gallery-artist');
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
      Artwork.find({ artist: req.session.currentUser }).then((allArtwork) => {
        allArtwork.forEach((singleArtwork) => {
          galleryFromDB.image.forEach((onePieceOfArt) => {
            if (singleArtwork._id.equals(onePieceOfArt)) {
              singleArtwork.isInGallery = true;
            }
          });
        });
      res.render('gallery-edit', { galleryFromDB, allArtwork });
    });
  })
    .catch((err) => console.log('error retrieving the Gallery', err));
  });

//post edits to DB  
  router.post('/gallery-edit/:galleryId', (req, res, next) => {
    if(!req.session.currentUser) {
      res.redirect('/auth/login');
    }

    const { galleryTitle, galleryDescription, galleryTheme, image } = req.body
    Gallery.findByIdAndUpdate(req.params.galleryId, { galleryTitle, galleryDescription, galleryTheme, image }, {new: true})
    .then((updatedGallery) => {
      res.redirect('/gallery-artist')
    })
    .catch((err) => console.log('error Editing the Gallery', err))
  })

  //***********DELETE GALLERY***********/
  router.post('/gallery-delete/:galleryId', (req, res, next) => {
    Gallery.findByIdAndRemove(req.params.galleryId)
    .then(() => res.redirect('/gallery-artist'))
    .catch((err) => console.log('Error deleting the gallery', err))
  });

  //*************** GALLERY DETAILS***************//
// const validImages = gallery.images.filter(image => image !== undefined)

router.get("/gallery-details/:galleryId", (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/gallery-details');
  }
  Gallery.findById(req.params.galleryId)
  .populate("image")
  .populate("author") 
  .then((galleryFromDB) => {
    res.render('gallery-details', { galleryFromDB })
  })
  // console.log(galleryFromDB)
  .catch((err) => console.log('Error, ', err))
});

router.get("/gallery-artist/", (req, res, next) => {
  Gallery.find({ author: req.session.currentUser} )
  .then((galleryFromDB) => {
    res.render('gallery-artist', { galleryFromDB })
  })
  .catch((err) => console.log('Error, ', err))
});
  module.exports = router;