const express = require('express')
const app = express()
const router = express.Router()
/* const PairPhotos = require('../models/pairphotos') */

router.use((req, res, next) => {
    req.app.set('layout', 'layouts/layout')
    next()
})

router.get('/', async (req,res) =>{
/*     let pairPhotos = new PairPhotos */ 
    try {
/*         pairPhotos.onload = function() {
            const imageWidth = pairPhotos.naturalWidth
            const newIMG = document.createElement(img)
            if(imageWidth >= 500) {
                newIMG.className = 'bigImg'
            }else{
                newIMG.className = 'smallImg'
            }
        } */
        /* pairPhotos = await PairPhotos.find().sort({uploadDate:'desc'}).exec() */
        res.render('pairphotos/index', /* {pairPhotos: pairPhotos} */)
    } catch  {
        res.redirect('index')
        //allert message
    }
})

module.exports = router