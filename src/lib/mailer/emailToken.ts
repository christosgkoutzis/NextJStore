import { createToken, decrypt } from "../../session";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { sendEmail } from "./mailer";

// Handles JWT token fetch from CMS and verification email sending to the user
export async function emailToken(username: string, password: string, id: number, email: string) {
  // Creates user's verification JWT token in WordPress headless CMS
  try {
    const encryptedToken = await createToken(username, password);
    console.log('register enc:', encryptedToken)
    if (typeof encryptedToken !== 'string'){
      return {error: encryptedToken.error};
    }
      // Sends a verification email to the user if there are email and id parameters in the function 
    if (encryptedToken){ 
      const mailer:SMTPTransport.SentMessageInfo  = await sendEmail(username, email, 'VERIFY', encryptedToken, id);
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
