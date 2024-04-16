import { SignJWT, jwtVerify } from "jose";
//import { createToken } from "./lib/verify";
/*import { cookies } from "next/headers";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server"; */

// Secretkey used for encryption (usually an environmental variable)
const secretKey = process.env.NEXT_PUBLIC_JWT_AUTH_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

// Takes as parameter the payload (body) of the JWT and encrypts it with HS256 algorithm and the API's secret key
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("60 mins from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
} 

export async function createToken(username: string, password: string) {
  // Creates user's verification JWT token in WordPress headless CMS
  try {
    const wpAppCredentials = {
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
  
      // Sends a verification email to the user if there are email and id parameters in the function
        return {token: encryptedToken};
    }
    else if (tokenFetch.status == 403){
      console.error({error: 'Wrong credentials.'});
      return {error: 'Wrong username or password. Please try again.'};
    }
    else {
      console.error({error: 'Unexpected error while fetching token. Please try again.'});
      return {error: 'Unexpected error while fetching token. Please try again.'};
    }
  }
  catch(error){
    console.error({error: 'Error while fetching the token from CMS'});
    return {error: 'Error while fetching the token from CMS'};
  } 
}

export async function login(credentials: {username: string, password: string}) {
  try {
    // Creates a JWT token and sends a verification email
    const token = await createToken(credentials.username, credentials.password);
    if (token.error){
      return { 'error': `${token.error}` };
    }
    const res = await fetch(process.env.NEXT_PUBLIC_DEPLOY_URL + 'api/cookie', {
      method: 'POST',
      body: JSON.stringify(token),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const session = await res.json()
    return session; 
    } catch (error) {
      console.error('Error logging in:', error);
      return {error: 'Internal Server Error'};
  }
}

























 /*export async function login(formData: FormData) {
  // Verifies the credentials and gets the user from the CMS (username accepts also email value as a REST API parameter)
  const credentials = { username: formData.get("email"), password: formData.get("password") };
  const res = await fetch(process.env.NEXT_PUBLIC_JWT_BASE + 'token', {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" }
  })
  const user = await res.json();
  if (user.token){
    const loggedinuser = {name: user.user_display_name, email: user.user_email}   
    // Defines expiration time (in secs) and creates the encrypted session object
    const expires = new Date(Date.now() + 60 * 5 * 1000);
    const session = await encrypt({ loggedinuser, expires });
  
    // Saves the session in a cookie (parameters are its expiration and that it is only read on server)
    cookies().set("session", session, { expires, httpOnly: true });
  }
  else {
    return user.message;
  }
}

// Deletes the session cookie to logout
export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
}

// Gets cookie information for routes that require login
export async function getSession(cookiename: string) {
  const session = cookies().get(cookiename)?.value;
  if (!session) return null;
  return await decrypt(session);
} */

// Used along with middleware function to refresh cookie expiration time
/*export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 60 * 5 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
} */