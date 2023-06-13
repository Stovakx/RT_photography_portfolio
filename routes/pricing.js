const express = require('express')
const app = express()
const router = express.Router()

router.use((req, res, next) => {
    req.app.set('layout', 'layouts/layout')
    next()
})

router.get('/', async(req, res) => {
    try{
        const currentURL = req.url
        res.render('pricing/index', {currentURL})
    }catch{
        res.redirect('index')
        //allert message
    }
})

module.exports = router