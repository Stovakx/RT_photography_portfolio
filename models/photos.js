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
    type: Number,
    required: true,
    default: 1
  },
  gallery:{
    type: Array,
    
  },
  filename: {
    type:String,
    
  }
});

// Define a pre-save middleware to assign a unique order number
photoSchema.pre('save', async function(next) {
  const Photo = mongoose.model('Photo');
  const lastPhoto = await Photo.findOne({}, {}, { sort: { order: -1 } });
  const lastOrder = lastPhoto ? lastPhoto.order : 0;
  this.order = lastOrder + 1;
  next();
});

photoSchema.virtual('photoPath').get(function() {
  if (this.filename != null) {
    return path.join('/uploads', photoBasePath, this.filename);
  }
});



module.exports = mongoose.model('Photo', photoSchema);
module.exports.photoBasePath = photoBasePath;

