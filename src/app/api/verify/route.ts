// API route that decrypts JWT tokens and redirects to /verified route or returns token as JSON according to params
import { createSession, decrypt, encrypt } from '@/session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Export function for GET method
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const token = url.searchParams.get("token");
    const username = url.searchParams.get("username");
    if (!id) {
      console.error('Error during verification: Incorrect URL parameters');
      return new NextResponse(JSON.stringify({error: 'Incorrect URL parameters'}), {status: 400});
    }
    // if there is no id param, redirects to /password-reset route to change user password
    if (!token){
      // Creates temporary session to the user to pass middleware authorization (didn't use /cookie API route because of immediate delete bug of the cookie)
      const temporaryPayload = {token: "forgot-password", id: id, email: "forgot-password", username: username, role: "subscriber"};
      const encryptedPayload = await encrypt(temporaryPayload);
      const expires = new Date(Date.now() + 60 * 5 * 1000);
      const temporarySession = cookies().set("session", encryptedPayload, { expires, httpOnly: true })
      // createSession() returns either a string for an encrypted session token or an object containing the error
      if(temporarySession){
        return NextResponse.redirect(new URL (process.env.NEXT_PUBLIC_DEPLOY_URL + `${username}/password-reset`)) 
      }
      else{
        console.error('Error creating the cookie');
        return new NextResponse(JSON.stringify({error: 'Error creating the cookie'}), {status: 500});
      }  
    }
    // If there is token param, redirects to /verified route to export email verification result
    const temporaryPayload = await decrypt(token);
    // Decrypts token to send it for verification
     const decryptedToken = temporaryPayload.token;
     // Creates temporary session to the user to pass middleware authorization
     const temporarySession = await createSession(temporaryPayload);
    // createSession() returns either a string for an encrypted session token or an object containing the error
    if(typeof temporarySession === 'string'){ 
      return NextResponse.redirect(new URL (process.env.NEXT_PUBLIC_DEPLOY_URL + `${temporaryPayload.username}/verified?id=${id}&token=${decryptedToken}`))
    }
    else{
      console.error('Error creating the cookie');
      return new NextResponse(JSON.stringify({error: 'Error creating the cookie'}), {status: 500});
    } 

  } catch (error) {
  console.error('Error during verification:', error);
  return new NextResponse(JSON.stringify({error}), {status: 500});
  }

}
