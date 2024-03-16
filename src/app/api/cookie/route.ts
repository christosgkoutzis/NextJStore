import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Export function for POST method
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = JSON.stringify(body);
    const expires = new Date(Date.now() + 60 * 5 * 1000);
    cookies().set("session", token, { expires, httpOnly: true });
    return new NextResponse(token, {status: 200});    
  } catch (error) {
    console.error('Error during setting session cookie:', error);
    return new NextResponse(JSON.stringify({error}), {status: 500});;
  }
}