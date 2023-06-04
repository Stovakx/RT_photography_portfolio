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
    required: true,
  },
});

const GalleryPhoto = mongoose.model('GalleryPhoto', galleryPhotoSchema);
module.exports = GalleryPhoto;
