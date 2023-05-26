const express = require('express')
const app = express()
const router = express.Router()

router.use((req, res, next) => {
    req.app.set('layout', 'layouts/layout')
    next()
})

router.get('/', async(req, res) => {
    try{
        res.render('pricing/index')
    }catch{
        res.redirect('index')
        //allert message
    }
})

module.exports = router