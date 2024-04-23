import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt, encrypt } from '@/session';

// Export function for POST method
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const encrypted = await encrypt(body);
    const token = JSON.stringify(encrypted);
    const expires = new Date(Date.now() + 60 * 5 * 1000);
    const cookie = await cookies().set("session", encrypted, { expires, httpOnly: true });
    if (cookie){
      return new NextResponse(token, {status: 200});     
    }
    else{
      console.error('Error while setting the cookie.')
      return {error: 'Error while setting the cookie.'}
    }
  } catch (error) {
    console.error('Error during setting session cookie:', error);
    return new NextResponse(JSON.stringify({error}), {status: 500});;
  }
}


export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const session = url.searchParams.get("cookie");
    // Decrypts session token and returns it back to middleware
    if (session){
      const decryptedCookie = await decrypt(session);
      return new NextResponse(JSON.stringify(decryptedCookie), {status: 200});
    }
    else{
      console.error('Note: Session cookie not found');
      return new NextResponse(JSON.stringify({error: 'Session cookie not found.'}), {status: 401});
    }
  } catch (error) {
    console.error('Error during getting session cookie:', error);
    return new NextResponse(JSON.stringify({error}), {status: 500});
  }
} 

// Export function for DELETE method
export async function DELETE(req: NextRequest) {
  try {
    await cookies().set("session", "", { expires: new Date(0) });
    return new NextResponse(JSON.stringify({success: 'Session deleted.'}), {status: 200});     
  } catch (error) {
    console.error('Error during setting session cookie:', error);
    return new NextResponse(JSON.stringify({error}), {status: 500});;
  }
}
