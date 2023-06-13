const express = require('express')
const router = express.Router()
const Photo = require('../models/photos')
const GalleryPhoto = require('../models/galleryPhotoSchema')
const Gallery = require('../models/gallery')

router.use((req, res, next) => {
    req.app.set('layout', 'layouts/layout')
    next()
})

router.get('/', async (req, res) => {
  try{
    const currentURL = 'gallery'
    const galleryPhotos = await GalleryPhoto.find();
    const gallery = await Gallery.findOne({name: 'párové fotky'}).populate('photos');
    const photoBasePath = Photo.photoBasePath;
    const photos = await Photo.find();
    res.render('pairphotos/index', {currentURL, photos, photoBasePath, gallery, galleryPhotos})
  }catch(err){
    console.log(err)
  }
})

module.exports = router
