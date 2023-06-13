const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Admin = require('../models/admin')
const Photo = require('../models/photos')
const Gallery = require('../models/gallery')
const GalleryPhoto = require('../models/galleryPhotoSchema');
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public' ,Photo.photoBasePath);
const photoMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const adminUpload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, photoMimeTypes.includes(file.mimetype))
  },
});
//setting layout for this route
router.use((req, res, next) => {
    req.app.set('layout', 'admin/admin_layout')
    next()
})
// Define a middleware function to check if the user is authenticated
const checkAuthentication = (req, res, next) => {
  console.log('checkAuthentication middleware');
  if (req.session.isAuthenticated) {
    // If the user is authenticated, allow them to proceed
    next();
  } else {
    console.log('Redirecting to login page')
    res.redirect('/admin');
  }
};

//login page
router.get('/', async (req, res) => {
    try{
      res.render('admin/index')
    }catch(err){
      console.log(err)
      res.redirect('/')
    }
})
//login form
router.post('/login', async (req, res) => {
  const { user, password } = req.body;

  try {
    // Find the admin user by username
    const adminUser = await Admin.findOne({ user: user });

    // If admin user not found, redirect to login with error message
    if (!adminUser) {
      return res.redirect('/admin?error=Invalid username or password');
    }

    // Check if password is correct
    const passwordMatch = await adminUser.comparePassword(password);

    // If password is incorrect, redirect to login with error message
    if (!passwordMatch) {
      return res.redirect('/admin?error=Invalid username or password');
    }

    // If username and password are correct, redirect to dashboard
    req.session.isAuthenticated = true;
    return res.redirect('/admin/dashboard');
  } catch (err) {
    console.log(err);
    return res.render('admin/index');
  }
});

//dasshboard
//dashboard
router.get('/dashboard', checkAuthentication, async (req, res) => {
  try {
    console.log('Inside /dashboard route handler'); // Add this line for logging
    const galleryPhotos = await GalleryPhoto.find();
    const galleries = await Gallery.find().populate('photos');
    const photoBasePath = Photo.photoBasePath;
    const photos = await Photo.find();
    res.render('admin/dashboard', { photos, photoBasePath, galleries, galleryPhotos });
  } catch (err) {
    console.error(err);
    res.redirect('/admin?error=Failed to load dashboard');
  }
});

// upload photo(index page works fine)
router.post('/dashboard/upload', adminUpload.array('image', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.redirect('/admin/dashboard?error=No files selected');
    }
    const photos = [];
    for (const file of req.files) {
      const photo = new Photo({
        name: file.originalname,
        filename: file.filename, // Save the file name in the database
      });
      photos.push(photo);
      await photo.save();
    }
    res.redirect('/admin/dashboard')
  } catch (error) {
    console.error(error);
    return res.redirect('/admin/dashboard');
  }
});

//delete action(works fine)
router.delete('/dashboard/delete', async (req, res) => {
  const { photoIds } = req.body;
  try {
    // Find the photos in the database
    const photos = await Photo.find({ _id: { $in: photoIds } }).sort({ date: -1 });
    if (photos.length === 0) {
      return res.status(404).json({ error: 'Photos not found' });
    }

    // Delete the files from the file system
    photos.forEach(photo => {
      const filePath = path.join(uploadPath, photo.filename);
      fs.unlinkSync(filePath);
    });

    // Remove the photos from the database
    await Photo.deleteMany({ _id: { $in: photoIds } });

    console.log('Photos successfully deleted');
    res.redirect('/admin/dashboard')
  } catch (err) {
    console.error(err);
    console.log('Cannot delete photos right now.');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//connect photos to galelry(works fine)
router.put('/dashboard/update', async (req, res) => {
  try {
    const photoIds = req.body.photoIds;
    const galleryId = req.body.galleryId;
    // Update the gallery and order for the selected photos
    const galleries = await Gallery.find();
    // Retrieve the updated photos
    const photos = await Photo.find({ _id: { $in: photoIds } });

    const galleryPhotos = await Promise.all(
      photos.map((photoId, index) => {
        const galleryPhoto = new GalleryPhoto({
          photo: photoId,
          gallery: galleryId,
          orderInGallery: index + 1,
        });
        console.log(galleryPhoto, 'Cesta k fotce byla uložena')
        return galleryPhoto.save();
      })
    );

    // Add newly created GalleryPhotoSchema docs to the gallery
    // Add newly created photo IDs to the existing array
    const gallery = await Gallery.findById(galleryId);
    const photoIdsToUpdate = galleryPhotos.map((galleryPhoto) => new mongoose.Types.ObjectId(galleryPhoto.photo));
    gallery.photos.push(...photoIdsToUpdate); 
 
    await gallery.save();
    console.log(gallery, 'Přidáno do galerie')
    
    return res.render('admin/dashboard', { photos, selectedPhotos: photoIds, photoBasePath: Photo.photoBasePath, gallery, galleryPhotos, galleries });
  } catch (error) {
    // Handle the error
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//logout, redirect to homepage?
router.get('/logout', (req, res) => {
  req.session.destroy();0
  res.redirect('/');
});

module.exports= router