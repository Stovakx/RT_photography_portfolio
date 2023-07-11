const mongoose = require('mongoose');
const path = require('path');
const photoBasePath = 'uploads/index';

const photoSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  filename: {
    type: String
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  }
});

photoSchema.virtual('photoPath').get(function() {
  if (this.filename != null) {
    return path.join('/uploads', photoBasePath, this.filename);
  }
});

const PhotoModel = mongoose.model('Photo', photoSchema);
module.exports = PhotoModel;
module.exports.photoBasePath = photoBasePath;
