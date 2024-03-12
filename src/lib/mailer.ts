'use server'

import nodemailer from 'nodemailer';
// File System package for reading files (reads from fs/promises for support of async reading)
import fs  from 'fs/promises';

// function that sends email through nodemailer
export const sendEmail = async(username: string, email: string, emailType: string, token: string, id: number) => {
  try {   
    // transporter sends email through nodemailer
    var transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: process.env.NEXT_PUBLIC_SMTP_PORT,
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USERNAME,
        pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
      }
    } as any);

    // Read the content of the HTML file (HTML template from unlayer.com) and replace its placeholders with variables
    let htmlContent = await fs.readFile('public/email-template.html', 'utf-8');
    htmlContent = htmlContent.replace('${USERNAME}', username);
    htmlContent = htmlContent.replace('${VERIFICATION_LINK}', process.env.NEXT_PUBLIC_DEPLOY_URL + `api/cookie?id=${id}&token=${token}`);
    // Configures email introducing message according to emailType
    let message: string
    if (emailType === 'VERIFY') {
      message = 'We want to thank you for registering in NextJStore and we have good news for you. You are only one step away from shopping from your Next ultimate shopping destination.&nbsp;'
    }
    else {
      message = 'Forgot your password? No need to worry! Recover it in only a few seconds.'
    }
    htmlContent = htmlContent.replace('${MESSAGE}', message)
    const mailOptions = {
      from: process.env.NEXT_PUBLIC_SMTP_USERNAME,
      to: email,
      subject: emailType === 'VERIFY' ? 'Verify your registration in NextJStore' : 'Reset your password in NextJStore',
      html: htmlContent
    }
    const mailer = await transporter.sendMail(mailOptions);
    return mailer;
  } catch (error:any) {
    throw new Error(error.message);  
  }
}