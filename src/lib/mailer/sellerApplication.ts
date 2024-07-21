"use server"

import nodemailer from 'nodemailer';

// Sends emails through nodemailer library
export const sellerApplication = async(name: string, username: string, description: string ) => {
  try {   
    // Transporter sends email through nodemailer
    var transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: process.env.NEXT_PUBLIC_SMTP_PORT,
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USERNAME,
        pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
      }
    } as any);
    const mailOptions = {
      from: process.env.NEXT_PUBLIC_SMTP_USERNAME,
      to: process.env.NEXT_PUBLIC_SMTP_USERNAME,
      subject: `${name}: Seller Application`,
      text: `Username: ${username}, Why to become a seller? ${description}`
    }
    const mailer = await transporter.sendMail(mailOptions);
    return mailer;
  } catch (error:any) {
    return ({error: error.message});  
  }
}