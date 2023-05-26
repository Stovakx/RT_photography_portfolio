const express = require('express')
const app = express()
const router = express.Router()
/* const AnimalPhotos = require('../models/animalPhotos') */


router.use((req, res, next) => {
    req.app.set('layout', 'layouts/layout')
    next()
})

router.get('/', async (req,res) =>{
    /* let animalPhotos  */
    try {
        /* animalPhotos = await AnimalPhotos.find().sort({uploadDate:'desc'}).exec() */
        res.render('animalphotos/index', /* {animalPhotos: animalPhotos} */)
    } catch  {
        res.redirect('index')
        //allert message
    }
})

module.exports = router