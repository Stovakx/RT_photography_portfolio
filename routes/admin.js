const express = require('express')
const router = express.Router()
const Admin = require('../models/admin')
const Photo = require('../models/photos')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Photo.photoBasePath);
const photoMimeTypes = ['image/jpeg', 'image/png'];
const adminUpload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, photoMimeTypes.includes(file.mimetype))
  },
  /* limits: { fieldSize: 10 * 1024 * 1024 } */ // Adjust the field size limit as needed
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
    const photoBasePath = Photo.photoBasePath;
    const photos = await Photo.find();
    res.render('admin/dashboard', { photos, photoBasePath });
  } catch (err) {
    console.error(err);
    res.render('admin/index');
  }
});
// upload photo(index page works fine)
router.post('/dashboard/upload', adminUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.redirect('/admin/dashboard?error=No file selected');
    }
    const photo = new Photo({
      filename: req.file.filename, // Save the file name in the database
      name: req.body.photoName,
    });

    await photo.save();
    res.setHeader('Refresh', '0; URL=/admin/dashboard');
    res.redirect('/admin/dashboard');
    console.log(photo);
  } catch (error) {
    console.error(error);
    return res.redirect('/admin/dashboard');
  }
});
//delete action
router.delete('/dashboard/delete', async (req, res) => {

  const { photoIds } = req.body;
  console.log(photoIds)
  try {
    // Find the photos in the database
    const photos = await Photo.find({ _id: { $in: photoIds } }).sort(Date);

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
    res.status(200).json({ message: 'Photos deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
//update order of images (need to be completed)
router.put('/dashboard/update', async (req, res) => {
  try {
    const photoIds = req.body.photoIds;
    const order = req.body.order; 
    console.log(photoIds, order)
    // Update the gallery and order for the selected photos
    await Photo.updateMany({ _id: { $in: photoIds } }, { $set: { order: order, gallery: 'galleryIndexPage' } });

    // Retrieve the updated photos
    const photos = await Photo.find({ _id: { $in: photoIds } });

    res.render('admin/dashboard', { photos, selectedPhotos: photoIds, photoBasePath: Photo.photoBasePath });
  } catch (error) {
    // Handle the error
    console.error(error);
  }
});


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

module.exports = router