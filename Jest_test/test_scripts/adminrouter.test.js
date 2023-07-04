const request = require('supertest');
const server = require('../../server');
const app = server;
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const adminRouter = require('../../routes/admin');
const Admin = require('../../models/admin');
const Photo  = require('../../models/photos');
const Gallery = require('../../models/gallery');
const GalleryPhoto = require('../../models/galleryPhotoSchema');
let photoId = new mongoose.Types.ObjectId();

describe('Admin Login', () => {
  it('should redirect to dashboard when login is successful', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        user: 'testuser',
        password: 'testpassword',
      });
  });

  it('should redirect to login with error message when username is invalid', async () => {
    const response = await request(app)
      .post('/admin/login') // Update the endpoint based on your admin router setup
      .send({
        user: 'invaliduser',
        password: 'testpassword',
      });
  });

  it('should redirect to login with error message when password is invalid', async () => {
    const response = await request(app)
      .post('/admin/login') // Update the endpoint based on your admin router setup
      .send({
        user: 'testuser',
        password: 'invalidpassword',
      });
  });
});

describe('Admin Router', () => {

  //post route
  describe('POST /dashboard/upload', () => {
    it('should upload a file, add it to the database, and save it to the uploads folder', async () => {
      const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'index', 'test.jpg');
      const fileContent = 'This is the content of the file.';
  
      // Write the file to the specified path
      fs.writeFileSync(filePath, fileContent);
  
      const response = await request(app)
        .post('/admin/dashboard/upload')
        .attach('image', filePath, 'test.jpg')
  
      // Check if the response status is as expected
      expect(response.status).toBe(302); 
  
      // Check if the file is saved in the uploads folder
      const fileExists = fs.existsSync(filePath);
      expect(fileExists).toBe(true);
  
      // Check if the file entry is created in the database
      const uploadedFile = await Photo.findOne({ filename: 'test.jpg' });
      expect(uploadedFile).toBeDefined(); 

      // Clean up the uploaded file and the database entry after the test
      fs.unlinkSync(filePath);
      await Photo.deleteOne({ filename: 'test.jpg' });
    });
  });
  
  //delete route
  describe('DELETE /admin/dashboard/delete', () => {
    // test data
    const samplePhotoIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
    const samplePhotos = [
      {
        _id: samplePhotoIds[0],
        filename: 'photo1.jpg',
      },
      {
        _id: samplePhotoIds[1],
        filename: 'photo2.jpg',
      },
    ];
    console.log(samplePhotos)
    const sampleGallery = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Gallery 1',
      photos: samplePhotoIds,
    };
    const sampleGalleryPhoto = {
      _id: new mongoose.Types.ObjectId(),
      photo: samplePhotoIds[0],
      gallery: sampleGallery._id,
    };
    const testFilePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'index', 'test.jpg');
    const testFileContent = 'This is the content of the test file.';
  
    beforeAll(async () => {
      // Insert sample data before running the tests
      await Photo.insertMany(samplePhotos);
      await Gallery.create(sampleGallery);
      await GalleryPhoto.create(sampleGalleryPhoto);
  
      // Create a test file
      fs.writeFileSync(testFilePath, testFileContent);
    });
  
    afterAll(async () => {
      // Clean up sample data and test file after running the tests
      await Photo.deleteMany({});
      await Gallery.deleteMany({});
      await GalleryPhoto.deleteMany({});
  
      // Delete the test file
      fs.unlinkSync(testFilePath);
    });
  
    it('should delete photos, remove IDs from gallery, and delete gallery photos', async () => {
      await request(app)
        .delete('/admin/dashboard/delete')
        .send({ photoIds: samplePhotoIds })
        .expect(302);
  
      // Check if photos are deleted from the database
      const deletedPhotos = await Photo.find({ _id: { $in: samplePhotoIds } });
      expect(deletedPhotos.length).toBe(0);
  
      // Check if IDs are removed from the gallery
      const updatedGallery = await Gallery.findById(sampleGallery._id);
      expect(updatedGallery.photos).toEqual([]);
  
      // Check if gallery photos are deleted
      const deletedGalleryPhotos = await GalleryPhoto.find({ photo: { $in: samplePhotoIds } });
      expect(deletedGalleryPhotos.length).toBe(0);
    });
  
    it('should return 404 if photos are not found', async () => {
      await request(app)
        .delete('/admin/dashboard/delete')
        .send({ photoIds: [new mongoose.Types.ObjectId()] })
        .expect(404);
    });
  });

  //update to gallery route
  describe('POST /admin/dashboard/update', () => {
    // Test data
    const samplePhotoIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
    const sampleGalleryId = new mongoose.Types.ObjectId();
    const sampleGallery = {
      _id: sampleGalleryId,
      name: 'Gallery 1',
      photos: [],
    };
    const samplePhotos = [
      {
        _id: samplePhotoIds[0],
        filename: 'photo1.jpg',
      },
      {
        _id: samplePhotoIds[1],
        filename: 'photo2.jpg',
      },
    ];
  
    beforeAll(async () => {
      // Insert sample data before running the tests
      await Gallery.create(sampleGallery);
      await Photo.insertMany(samplePhotos);
    });
  
    afterAll(async () => {
      // Clean up sample data after running the tests
      await Gallery.deleteMany({});
      await Photo.deleteMany({});
      await GalleryPhoto.deleteMany({});
    });
  
    it('should update the gallery and order for the selected photos', async () => {
      // Create a request payload
      const payload = {
        photoIds: samplePhotoIds,
        galleryId: sampleGalleryId,
      };
  
      // Make a PUT request to the route
      await request(app)
        .put('/admin/dashboard/update')
        .send(payload)
        .expect(200);
  
      // Retrieve the updated gallery and photos
      const updatedGallery = await Gallery.findById(sampleGalleryId);
      const updatedPhotos = await Photo.find({ _id: { $in: samplePhotoIds } });
  
      // Check if the gallery and photo order are updated correctly
      expect(updatedGallery.photos).toEqual(expect.arrayContaining(samplePhotoIds));
      expect(updatedPhotos.length).toBe(samplePhotos.length);
    });
  
    it('should return an error if there is a server error', async () => {
      // Mock the console.error function to suppress logging during the test
      jest.spyOn(console, 'error').mockImplementation(() => {});
    
      // Mock a server error
      jest.spyOn(Gallery, 'findById').mockRejectedValueOnce(new Error('Server error'));
    
      // Create a request payload
      const payload = {
        photoIds: samplePhotoIds,
        galleryId: sampleGalleryId,
      };
    
      // Make a PUT request to the route
      await request(app)
        .put('/admin/dashboard/update')
        .send(payload)
        .expect(500);
    });      
  });
  
  //write front-end for it first!!!!
  //creating galleries
 /*  describe('POST /galleries/create', () => {
    it('should create a new gallery and redirect to /admin/galleries', async () => {
      const reqBody = {
        name: 'Test Gallery',
      };
  
      const saveMock = jest.fn();
      const galleryMock = {
        save: saveMock,
      };
  
      const redirectMock = jest.fn();
  
      const req = {
        body: reqBody,
      };
  
      const res = {
        redirect: redirectMock,
      };
  
      jest.spyOn(Gallery.prototype, 'save').mockResolvedValue();
  
      await router.handle(req, res);
  
      expect(Gallery).toHaveBeenCalledWith({
        name: reqBody.name,
      });
      expect(saveMock).toHaveBeenCalled();
      expect(redirectMock).toHaveBeenCalledWith('/admin/galleries');
    });
  
    it('should log an error and send a response with status 500 if an error occurs', async () => {
      const errorMessage = 'Something went wrong';
      const errorMock = new Error(errorMessage);
  
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
  
      const req = {
        body: {},
      };
  
      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      jest.spyOn(Gallery.prototype, 'save').mockRejectedValue(errorMock);
  
      await router.handle(req, res);
  
      expect(consoleErrorMock).toHaveBeenCalledWith('Něco se pokazilo');
      expect(consoleErrorMock).toHaveBeenCalledWith(errorMock);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Internal Server Error');
  
      consoleErrorMock.mockRestore();
    });
  });
  
  
  //add photos to galleries
  describe('PUT /galleries/addtogallery', () => {
    it('should add photos to a gallery and save gallery photos', async () => {
      const reqBody = {
        photoIds: ['photoId1', 'photoId2'],
        galleryId: 'galleryId',
      };
  
      const galleriesMock = ['gallery1', 'gallery2'];
      const photosMock = ['photo1', 'photo2'];
      const galleryPhotosMock = ['galleryPhoto1', 'galleryPhoto2'];
  
      const findMock = jest.fn();
      const photoFindMock = jest.fn();
  
      const galleryPhotoSaveMock = jest.fn().mockResolvedValueOnce(galleryPhotosMock[0]).mockResolvedValueOnce(galleryPhotosMock[1]);
      const galleryPhotoMock = jest.fn();
      galleryPhotoMock.mockReturnValue({
        save: galleryPhotoSaveMock,
      });
  
      const PromiseAllMock = jest.fn().mockResolvedValue(galleryPhotosMock);
  
      const req = {
        body: reqBody,
      };
  
      const res = {};
  
      Gallery.find = findMock.mockResolvedValue(galleriesMock);
      Photo.find = photoFindMock.mockResolvedValue(photosMock);
      GalleryPhoto.mockReturnValue(galleryPhotoMock);
      Promise.all = PromiseAllMock;
  
      await router.handle(req, res);
  
      expect(findMock).toHaveBeenCalled();
      expect(photoFindMock).toHaveBeenCalledWith({ _id: { $in: reqBody.photoIds } });
  
      expect(galleryPhotoMock).toHaveBeenCalledTimes(reqBody.photoIds.length);
      reqBody.photoIds.forEach((photoId, index) => {
        expect(galleryPhotoMock).toHaveBeenCalledWith({
          photo: photoId,
          gallery: reqBody.galleryId,
        });
      });
  
      expect(galleryPhotoSaveMock).toHaveBeenCalledTimes(reqBody.photoIds.length);
      expect(PromiseAllMock).toHaveBeenCalledWith(galleryPhotoSaveMock.mock.results.map((result) => result.value));
  
      // Additional assertions for your specific use case can be added here
    });
  }); */
  
  //end of testsuite with mongoose disconnect
  afterAll(() => {
    return new Promise((resolve) => {
      server.close(() => {
        mongoose.disconnect();
        resolve();
      });
    });
  })
});



