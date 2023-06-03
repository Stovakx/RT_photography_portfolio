const express = require('express')
const router = express.Router()
const Admin = require('../models/admin')
const Photo = require('../models/photos')
const GalleryPhotoSchema = require('../models/galleryPhotoSchema')
const Gallery = require('../models/gallery') 
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
  // Check if the user is logged in
  if (req.session.isAuthenticated) {
    // If the user is authenticated, allow them to proceed
    next();
  } else {
    // If the user is not authenticated, redirect them to the login page
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
      const errorMessage = ''
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
router.get('/dashboard', checkAuthentication, async (req, res) => {
  try {
    const galleryPhotos = await GalleryPhotoSchema.find();
    const galleries = await Gallery.find();
    const photoBasePath = Photo.photoBasePath;
    const photos = await Photo.find();
    res.render('admin/dashboard', { photos, photoBasePath, galleries, galleryPhotos, galleryId: req.query.galleryId });
  } catch (err) {
    console.error(err);
    res.render('admin/index');
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
    
    res.setHeader('Refresh', '0; URL=/admin/dashboard');
    res.redirect('/admin/dashboard');
    console.log(photos);
  } catch (error) {
    console.error(error);
    return res.redirect('/admin/dashboard');
  }
});

//delete action(works fine)
router.delete('/dashboard/delete', async (req, res) => {

  const { photoIds } = req.body;
  console.log(photoIds)
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
    res.render('admin/dashboard', { photos, photoIds, photoBasePath: Photo.photoBasePath });
    console.log('photos successfully deleted')
  } catch (err) {
    console.error(err);
    console.log(err,'Cannot delete photos right now.')
  }
});
//connect photos to gallery (works fine)
router.put('/dashboard/update', async (req, res) => {
  try {
    const photoIds = req.body.photoIds;
    const galleryId = req.body.galleryId; 
    const galleries = await Gallery.find(); // Retrieve all galleries
    
    // Update the gallery and order for the selected photos
    await Photo.updateMany({ _id: { $in: photoIds } }, { $set: { gallery: galleryId } });

    // Retrieve the updated photos
    const photos = await Photo.find({ _id: { $in: photoIds } });

    const galleryPhotos = await Promise.all(
      photos.map((photoId, index) => {
        const galleryPhoto = new GalleryPhotoSchema({
          photo: photoId,
          gallery: galleryId,
          orderInGallery: index + 1,
        });
        console.log(galleryPhoto)
        return galleryPhoto.save();
      })
    );
    
    // Add newly created GalleryPhotoSchema docs to the gallery
    const gallery = await Gallery.findById(galleryId);
    gallery.photos.push(...galleryPhotos.map((photo) => photo._id));
    await gallery.save();
    
    res.render('admin/dashboard', { photos, selectedPhotos: photoIds, photoBasePath: Photo.photoBasePath, gallery, galleries});
  } catch (error) {
    // Handle the error
    console.error(error);
  }
});

//reorder gallery form
router.put('/dashboard/orderUpdate', async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error)
    res.redirect('/admin/dashboard')
  }
})




//end of dashboard routes


//animal photos
router.get('/animalphotos',checkAuthentication, async(req, res) => {
  try {
    //change to animalphotos model
    const photoBasePath = Photo.photoBasePath;
    const photos = await Photo.find()
    res.render('admin/animalphotos', {photos, photoBasePath})
  } catch (error) {
    console.error(error);
    res.render('admin/index', { error: 'Admin panel je zrovna nefunkční.'});
  }
});

//end of animal routes


//pair photos
router.get('/pairphotos',checkAuthentication, async(req, res) => {
  try {
    //change to pairphotos model
    const photoBasePath = Photo.photoBasePath;
    const photos = await Photo.find()
    res.render('admin/pairphotos', {photos, photoBasePath})
  } catch (error) {
    console.error(error);
    res.render('admin/index', { error: 'Admin panel je zrovna nefunkční.'});
  }
});

//end of pair routes


//otherphotos
router.get('/other',checkAuthentication, async(req, res) => {
  try {
    //change to other model
    const photoBasePath = Photo.photoBasePath;
    const photos = await Photo.find()
    res.render('admin/other', {photos, photoBasePath})
  } catch (error) {
    console.error(error);
    res.render('admin/index', { error: 'Admin panel je zrovna nefunkční.'});
  }
});

//end of other routes


// updating "order" of photos, "order" is for order of photos on website

//logout, redirect to homepage?
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports= router