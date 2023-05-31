const mongoose = require('mongoose');
const path = require('path');
const photoBasePath = 'uploads/index';

const photoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  order: {
    type: [Number],
    required: true,
    default: 1
  },
  gallery: {
    type: [String], // Changed to an array of strings
    required: true,
    default: []
  },
  filename: {
    type: String
  }
});

// Define a pre-save middleware to assign a unique order number
photoSchema.pre('save', async function(next) {
  const galleries = this.gallery; // Get the array of galleries for the photo

  let lastPhoto;
  let lastOrder;

  // Find the last photo for each gallery and get the highest order number
  for (const gallery of galleries) {
    const query = { gallery };
    if (lastPhoto) {
      query.order = { $gt: lastOrder }; // Only consider photos with order greater than the previous highest order
    }
    lastPhoto = await Photo.findOne(query).sort({ order: -1 });
    lastOrder = lastPhoto ? lastPhoto.order : 0;
  }

  this.order = lastOrder + 1;

  // default order value
  if (this.order === 1 && !lastPhoto) {
    this.order = lastOrder + 1;
  }

  next();
});


photoSchema.virtual('photoPath').get(function() {
  if (this.filename != null) {
    return path.join('/uploads', photoBasePath, this.filename);
  }
});



module.exports = mongoose.model('Photo', photoSchema);
module.exports.photoBasePath = photoBasePath;

