import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_EMAIL_SECRET,
  },
});


const sendEmail = async (to: string, subject: string, content: string): Promise<void> => {

  try {
    const info = await transporter.sendMail({
      from: process.env.APP_EMAIL,
      to: (process.env.APP_ENV === 'development' ? process.env.APP_EMAIL : to),
      subject: subject,
      html: content,
    });

    console.log('Email sent successfully: ', info);

  } catch (error: any) {
    console.error('Error sending email: ', error);
    throw new Error(error);
  }
}


export default sendEmail;