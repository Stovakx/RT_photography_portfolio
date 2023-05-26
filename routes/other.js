const express = require('express')
const app = express()
const router = express.Router()
/* const Other = require('../models/other') */

router.use((req, res, next) => {
    req.app.set('layout', 'layouts/layout')
    next()
})

router.get('/', async (req,res) =>{
    /* let other  */
    try {
        /* other = await Other.find().sort({uploadDate:'desc'}).exec() */
        res.render('other/index', /* {other: other} */)
    } catch  {
        res.redirect('index')
        //allert message
    }
})

module.exports = router

