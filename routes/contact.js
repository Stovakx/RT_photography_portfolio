const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const multiparty = require('multiparty')




router.get('/', async (req, res) => {
  try{
    const currentURL = req.url
    res.render('contact/index', {currentURL})
  }catch(err){
    console.log(err)
  }
})

//rework to async (try catch)
router.post('/send', (req) => {
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
  transporter.verify(function (error) {
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
    console.log(err)
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
    transporter.sendMail(mail, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email byl odeslán')
      }
      
    })
  })
})
module.exports = router
