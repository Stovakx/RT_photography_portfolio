const mongoose = require('mongoose');

const galleryPhotoSchema = new mongoose.Schema({
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
  },
  gallery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gallery',
  },
  orderInGallery: {
    type: Number,
  }
});

const GalleryPhotoSchema = mongoose.model('GalleryPhotoSchema', galleryPhotoSchema);
module.exports = GalleryPhotoSchema;
