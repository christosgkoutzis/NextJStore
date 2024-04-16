// API route that decrypts JWT tokens and redirects to /verified route or returns token as JSON according to params
import { decrypt } from '@/session';
import { NextRequest, NextResponse } from 'next/server';

// Export function for GET method
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    let token = url.searchParams.get("token");
    if (!token) {
      console.error('Error during verification: Incorrect URL parameters');
      return new NextResponse(JSON.stringify({error: 'Incorrect URL parameters'}), {status: 400});
    }
    // Decrypts token to send it for verification
    const decrypted = await decrypt(token);
    // if there is no id param, redirects to /password-reset route to change user password
    if (!id){
      if (decrypted.id){
        return NextResponse.redirect(new URL (process.env.NEXT_PUBLIC_DEPLOY_URL + `password-reset?id=${decrypted.id}`))
      }
      else{
        return new NextResponse(JSON.stringify({error: 'Error decrypting the token.'}), {status: 500});
      }
    }
    // If there is id param, redirects to /verified route to export email verification result
    const decryptedToken = decrypted.token;
    // Logs in through cookie the user to pass middleware authorization

    /*const tokenValidate = await fetch(process.env.NEXT_PUBLIC_JWT_BASE + 'token/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${decryptedToken}`
      },
    });  */

   /* const res = await fetch(process.env.NEXT_PUBLIC_DEPLOY_URL + 'api/cookie', {
      method: 'POST',
      body: JSON.stringify({token: `${decryptedToken}`}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(res.ok){ */
    return NextResponse.redirect(new URL (process.env.NEXT_PUBLIC_DEPLOY_URL + `verified?id=${id}&token=${decryptedToken}`))
   /* }
    else{
      console.error('Error creating the cookie');
      return new NextResponse(JSON.stringify({error: 'Error creating the cookie'}), {status: 500});
    } */

  // Exception error handler
  } 
  catch (error) {
  console.error('Error during verification:', error);
  return new NextResponse(JSON.stringify({error}), {status: 500});
  }

}
