import { sendEmail } from "@/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { encrypt } from "./session";

 export async function createToken(username: string, email: string, password: string, id: number) {
  // Creates user's verification JWT token in WordPress headless CMS
  const wpAppCredentials = {
    username: process.env.NEXT_PUBLIC_WP_ADMIN_USERNAME,
    password: process.env.NEXT_PUBLIC_WP_REGISTER_APP_PASSWORD,
  };
  const encryptedWpAppCredentials = btoa(`${wpAppCredentials.username}:${wpAppCredentials.password}`);
  const tokenFetch = await fetch(process.env.NEXT_PUBLIC_JWT_BASE + 'token', {
    method: 'POST',
    body: JSON.stringify({username, password}),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encryptedWpAppCredentials}`
    },
  });
  const json = await tokenFetch.json()
  if(tokenFetch.ok){
    // Encrypts token using jose and secret key (session.ts)
    const encryptedToken = await encrypt(json);
    console.log('Encrypted:', encryptedToken)
    // Sends a verification email to the user
    const mailer: SMTPTransport.SentMessageInfo = await sendEmail(username, email, 'VERIFY', encryptedToken, id);
    if (mailer){
      return json;
      }
    else{
      console.error('Error while creating the cookie.')
      return ('Error while creating the cookie')
    }
  }
  else{
    console.error('Error while fetching the token from CMS.')
    return ('Error while fetching the token from CMS')
  }
} 

export async function verify(token: string) {
      // Validates a JWT token in WP headless CMS
      const validated = await fetch(process.env.NEXT_PUBLIC_JWT_BASE + 'token/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      console.log('validated: ', validated.status)
      if(validated.status == 200){
        return 200;
      }
      else{
        console.error('Error validating the token.')
        return ('Error validating the token');
      }
  }
  

