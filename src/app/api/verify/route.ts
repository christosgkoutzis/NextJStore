// API route that redirects user to /verified page route for email verification
import { decrypt } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

// Export function for GET method
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    let token = url.searchParams.get("token");
    if (!token || !id){
      console.error('Error during verification: Incorrect URL parameters');
      return new NextResponse(JSON.stringify({error: 'Incorrect URL parameters'}), {status: 400});
    }
    // Decrypts token to send it for verification
    const decrypted = await decrypt(token);
    const decryptedToken = decrypted.token;
    return NextResponse.redirect(new URL (process.env.NEXT_PUBLIC_DEPLOY_URL + `verified?id=${id}&token=${decryptedToken}`))

  // Exception error handler
  } 
  catch (error) {
  console.error('Error during verification:', error);
  return new NextResponse(JSON.stringify({error}), {status: 500});;
  }

}
