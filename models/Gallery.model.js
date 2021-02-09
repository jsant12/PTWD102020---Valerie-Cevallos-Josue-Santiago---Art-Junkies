const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const gallerySchema = new Schema({
//these keys will pull in all the information by ObjectId from the respective collection
  galleryTitle: {
    type: String,
    default: 'My Gallery'},
  galleryDescription: {type: String},
  galleryTheme: {type: String},
  // title: [{type: Schema.Types.ObjectId, ref: 'Artwork'}],
  // in gallery details route create key for the hbs { editable: galleyFromDb.author === req.session.currentUser._id, galleryFromDb }
  author: {type: Schema.Types.ObjectId, ref: 'User'}, //get current user of session and plug in the current _id to compare if the page is editable
  image: [{type: Schema.Types.ObjectId, ref: 'Artwork'}],
}, 
{
  timestamps: true
});

module.exports = model('Gallery', gallerySchema);