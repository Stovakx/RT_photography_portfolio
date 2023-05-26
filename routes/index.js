const express = require('express')
const app = express()
const router = express.Router()
//sending email modules
const nodemailer = require('nodemailer')
const multiparty = require('multiparty')


router.use((req, res, next) => {
  req.app.set('layout', 'layouts/layout')
  next()
})

router.get('/', async (req, res) => {
  //gallery photos from model
    try{
      res.render('index')
    }catch{}
  })

  //rework to async (try catch)
router.post('/send', (req, res) => {
  //transporter, email from which you will receive email
  const transporter = nodemailer.createTransport({
    host: process.env.SENDER_HOST,
    port: 587,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PW
    }
  });
  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error)
    } else {
      console.log("Server is ready to take our messages")
    }
  });
    //taking data from form page with index.js
    let form = new multiparty.Form()
    let data = {}
    form.parse(req, function (err, fields) {
      console.log(fields);
      Object.keys(fields).forEach(function (property) {
        data[property] = fields[property].toString()
      })

      //How emails is looking změnit na klientův email env
      const mail = {
        from: data.email,
        to: process.env.EMAIL_RECEIVER,
        subject: 'objednání focení',
        text: `${data.firstName} ${data.lastName}
              \n ${data.telephone} 
              \n ${data.message}`,
      };
      console.log(mail)
      //messages if email was sent or no
      transporter.sendMail(mail, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Něco se pokazilo, zkuste to prosím znova." })
        } else {
          res.status(200).json({ message: "Email byl odeslán." })
          
        }
        
      })
    })
})
  module.exports = router
