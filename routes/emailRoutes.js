
const router = require('express').Router();
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');



const getemail = (req, res) => {
    const {
      email,
      nama,
      total
    } = req.body;

    console.log(email,nama,total)
  

    const config = {
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'ammararief321@gmail.com',
        pass: 'jvgrxaubmrsqbtpg'
      }
    };
  
      const transporter = nodemailer.createTransport(config);
  
      const MailGenerator = new Mailgen({
        theme: 'default',
        product: {
          name: 'Amayonaise',
          link: 'https://instagram.com/mmararief'
        }
      });
  
      let response = {
        body: {
          name: nama,
          intro: 'Thank you for registration',
          table: [
            {
              title: 'information Payment',
              data: [
                {
                  name: nama, // Include the newly generated ID in the email
                  total: total
                }
              ]
            }
          ],
          outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
      };
  
      const mail = MailGenerator.generate(response);
  
      const message = {
        from: 'ammararief321@gmail.com',
        to: email,
        subject: 'Segera Melakukan Pembayaran',
        html: mail
      };
  
      transporter.sendMail(message).then(() => {
        return res.status(201).json({
          msg: `Email terkirim ke ${userEmail}`,
          results
        });
      }).catch(error => {
        return res.status(500).json({ error });

      });
}

router.post('/sendemail', getemail);

module.exports = router
  