const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo', 
    },
  ],
});


const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
