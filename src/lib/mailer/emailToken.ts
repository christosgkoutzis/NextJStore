import { createToken, encrypt } from "../../session";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { sendEmail } from "./mailer";

// Handles JWT token fetch from CMS and verification email sending to the user
export async function emailToken(username: string, password: string, id: number, email: string) {
  // Creates user's verification JWT token in WordPress headless CMS
  try {
    const token = await createToken(username, password);
    if ('error' in token){
      return {error: token.error};
    }
    const encryptedToken = await encrypt(token);
      // Sends a verification email to the user if there are email and id parameters in the function 
    if (encryptedToken){ 
      const mailer:SMTPTransport.SentMessageInfo  = await sendEmail(username, email, 'VERIFY', id, encryptedToken);
      if (mailer){
        return encryptedToken;
        }
      else{
        console.error('Error while sending the verification email.')
        return ({error: 'Error while sending the verification email.'})
      }
    }
    else {
      console.error({error: 'Error while fetching the token from CMS'});
      return {error: 'Error while fetching the token from CMS'};
    }
  }
  catch(error){
    console.error({error});
    return {error: 'Error while fetching the token from CMS'};
  } 
}
