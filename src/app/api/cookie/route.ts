import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/session';

// Export function for POST method
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('post body:', body)
    const token = JSON.stringify(body);
    const expires = new Date(Date.now() + 60 * 5 * 1000);
    cookies().set("session", token, { expires, httpOnly: true });
    return new NextResponse(token, {status: 200});     
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

// Export function for POST method
export async function DELETE(req: NextRequest) {
  try {
    cookies().set("session", "", { expires: new Date(0) });
    return new NextResponse(JSON.stringify({success: 'Session deleted.'}), {status: 200});     
  } catch (error) {
    console.error('Error during setting session cookie:', error);
    return new NextResponse(JSON.stringify({error}), {status: 500});;
  }
}


/*export async function GET(req: NextRequest) {
  try {
    const session = cookies().get("session")?.value;
    // Validates session token in WP CMS
    if (session){
    // Converts stringfied token to object, decrypts it and validates it in WP CMS
      const json = JSON.parse(session);
      if (json.token){
        // Encrypted WP JWT token structure (object)
        const wpJwtToken = json.token;
        // Decrypted JWT token structure (object)
        const parsed = await decrypt(wpJwtToken);
        // Gets only the token value from the object
        const decryptedToken = parsed.token
        json.token = decryptedToken;
        // Returns decrypted token
        return new NextResponse(JSON.stringify(json), {status: 200});
      }
      else{
        console.error('Error: Incorrect JWT token structure.');
        return new NextResponse(JSON.stringify({error: 'Incorrect JWT token structure.'}), {status: 500});
      }
    }
    else{
      console.error('Note: Session cookie not found');
      return new NextResponse(JSON.stringify({error: 'Session cookie not found.'}), {status: 401});
    }
  } catch (error) {
    console.error('Error during getting session cookie:', error);
    return new NextResponse(JSON.stringify({error}), {status: 500});
  }
} */