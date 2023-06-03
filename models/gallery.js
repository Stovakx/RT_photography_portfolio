const mongoose = require('mongoose');

const galleriesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryPhotoSchema', 
    },
  ],
});

const Galleries = mongoose.model('Gallery', galleriesSchema);
module.exports = Galleries;
