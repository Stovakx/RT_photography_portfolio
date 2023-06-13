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

/* galleryPhotoSchema.index({ gallery: 1, photo: 1 }, { unique: true }); */

const GalleryPhoto = mongoose.model('GalleryPhoto', galleryPhotoSchema);
module.exports = GalleryPhoto;
