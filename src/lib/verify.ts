import { sendEmail } from "@/lib/mailer";
import { createToken } from "../session";
import SMTPTransport from "nodemailer/lib/smtp-transport";

 export async function emailToken(username: string, password: string, id: number, email: string) {
  // Creates user's verification JWT token in WordPress headless CMS
  try {
    const encryptedToken = await createToken(username, password);
    if (encryptedToken.error){
      return {error: encryptedToken.error};
    }
    /*const wpAppCredentials = {
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
  
      // Sends a verification email to the user if there are email and id parameters in the function */
    if (encryptedToken.token){ 
      const mailer:SMTPTransport.SentMessageInfo  = await sendEmail(username, email, 'VERIFY', encryptedToken.token, id);
      if (mailer){
        return encryptedToken;
        }
      else{
        console.error('Error while sending the verification email.')
        return ({error: 'Error while sending the verification email.'})
      }
      /*}
      else {
        return encryptedToken;
      } */
    }
    else {
      console.error({error: 'Error while fetching the token from CMS'});
      return {error: 'Error while fetching the token from CMS'};
    }
   /* else if (tokenFetch.status == 403){
      console.error({error: 'Wrong credentials.'});
      return {error: 'Wrong username or password. Please try again.'};
    } */ 
  }
  catch(error){
    console.error({error: 'Error while fetching the token from CMS'});
    return {error: 'Error while fetching the token from CMS'};
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
  

