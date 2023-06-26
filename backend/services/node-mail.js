const nodemailer=require('nodemailer');
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'satpreet410@gmail.com',
        pass:'upfuwxqnwyfbuwub'
    }
})

const sendMail = async (transporter,mailOptions) => {
    try {
        const mailDetail=await transporter.sendMail(mailOptions);
          return mailDetail?.messageId; 
    } catch (error) {
        return null;
    }
    
}
module.exports={transporter,sendMail}





