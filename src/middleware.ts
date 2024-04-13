// Middleware that always runs before components render and provides authorization
import {  NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt, encrypt } from "./session";

const protectedRoutes = ["/verified", "/password-reset"];

export default async function middleware(req: NextRequest) {   
  const session = cookies().get("session")?.value;
  if(session === undefined && protectedRoutes.includes(req.nextUrl.pathname)){
    const absoluteURL = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  // Refresh the session (if there is one) so it doesn't expire
  if (session !== undefined){
    const json = JSON.parse(session);
    if (json.token){
      const token = json.token;
      const parsed = await decrypt(token);
      parsed.expires = new Date(Date.now() + 60 * 5 * 1000);
      const res = NextResponse.next();
      res.cookies.set({
        name: "session",
        value: JSON.stringify({token : `${await encrypt(parsed)}`}),
        httpOnly: true,
        expires: parsed.expires,
      });
      return res;  
    }
  } 
}