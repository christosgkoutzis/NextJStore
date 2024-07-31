"use server"

import nodemailer from 'nodemailer';
// File System package for reading files (reads from fs/promises for support of async reading)
import fs  from 'fs/promises';
import path from 'path';

// Sends emails through nodemailer library
export const sendEmail = async(username: string, email: string, emailType: string, id: number, token?: string) => {
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
    // Reads the content of the HTML file (HTML template from unlayer.com) and replaces its placeholders with variables
    let htmlTemplatePath = path.join(process.cwd(), 'public/email-template.html');
    let htmlContent = await fs.readFile(htmlTemplatePath, 'utf-8');
    htmlContent = htmlContent.replace('${USERNAME}', username);
    htmlContent = htmlContent.replace('${HOMEPAGE}', `${process.env.NEXT_PUBLIC_DEPLOY_URL}`);
    // Configures email introducing message according to emailType
    let message, welcome: string
    if (emailType === 'VERIFY') {
      htmlContent = htmlContent.replace('${VERIFICATION_LINK}', process.env.NEXT_PUBLIC_DEPLOY_URL + `api/verify?id=${id}&token=${token}`);
      welcome = 'Welcome to NextJStore !! Your Next Stop for shopping !!'
      message = 'We want to thank you for registering in NextJStore and we have good news for you. You are only one step away from shopping from your Next ultimate shopping destination.&nbsp;'
    }
    else {
      htmlContent = htmlContent.replace('${VERIFICATION_LINK}', process.env.NEXT_PUBLIC_DEPLOY_URL + `api/verify?id=${id}&username=${username}`);
      welcome = 'Reset your account password in NextJStore'
      message = 'Forgot your password? No need to worry! Reset it in only a few seconds.'
    }
    htmlContent = htmlContent.replace('${WELCOME}', welcome)
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