const nodemailer = require('nodemailer');
require('dotenv').config();

let trasporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendMailDetails = async (mailDetails) => {
    let mailOptions = {
        from: process.env.EMAIL,
        to: mailDetails.to,
        subject: mailDetails.subject,
        text: mailDetails.text,
        rejectUnauthorized: false

    }
    try{
        await trasporter.sendMail(mailOptions);
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}

exports.sendMailDetails = sendMailDetails;