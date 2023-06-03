'use strict'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require("express")
const app = express()
const methodOverride = require('method-override');
const bodyParser = require('body-parser')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const crypto = require('crypto')
//mongoose+db
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, 
  { useNewUrlParser: true }) 
  const db = mongoose.connection
  db.on('error', error => console.log(error))
  db.once('open', () => console.log('Connected to database'))
app.use(bodyParser.urlencoded({ extended: true }));
const sessionSecret = crypto.randomBytes(32).toString('hex')
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}))

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});
//routes
const indexRouter = require('./routes/index')
const animalPhotosRouter = require('./routes/animalphotos')
const pairPhotosRouter = require('./routes/pairphotos')
const pricingRouter = require('./routes/pricing')
const otherRouter = require('./routes/other')
const adminRouter = require('./routes/admin')

//port
const port = process.env.PORT || 3000;

//ejs layout settings + public folder
app.use(express.json());
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(expressLayout)
app.use(express.static('public'))
app.use(methodOverride('_method'))
//routes
app.use('/', indexRouter)
app.use('/animalphotos', animalPhotosRouter)
app.use('/parovefotky', pairPhotosRouter)
app.use('/cenik', pricingRouter)
app.use('/ostatni', otherRouter)
app.use('/admin', adminRouter)

// Express server listening...
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
