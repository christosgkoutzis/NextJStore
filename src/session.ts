import { SignJWT, jwtVerify } from "jose";
import { wp_fetch } from "./lib/wp-fetch";

export interface UserInfo{
  token: string
  id: number
  email: string
  username: string
  role: string
}

// Secretkey used for encryption (usually an environmental variable)
const secretKey = process.env.NEXT_PUBLIC_JWT_AUTH_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

// Takes as parameter the session payload and encrypts it with HS256 algorithm and the secret key
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("60 mins from now")
    .sign(key);
}

// Decrypts the session cookie value
export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error('Error while decrypting the token:', error)
    return {error};
  }
}


// Fetches required user's informaion from WP CMS and forms the payload of the session cookie (limits results to 1 to avoid multiple usernames)
export async function infoFetch(username: string, token: string): Promise<UserInfo | { error: string; }>{
  try {
      const infoFetch = await wp_fetch(`users?search=${username}&context=edit&per_page=1`,'GET');
      const userInfo = {token: token, id: infoFetch[0].id, email: infoFetch[0].email, username: infoFetch[0].username, role: infoFetch[0].roles[0]};
      return userInfo;
    }
     catch(error){
      console.error({error});
      return {error: 'Error while fetching the token from CMS.'};
    } 
}

// Fetches a JWT token and required account information from WP CMS for the payload of the session's cookie
export async function createToken(username: string, password: string) {
  try {
    // Fetches JWT token from JWT plugin custom REST API endpoint
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
      // Gets JWT token from response object
      const WPJWTToken = json.token;
      // Fetches required userinfo and creates cookie's payload from infoFetch
      const userInfo = await infoFetch(username, WPJWTToken);
      if('error' in userInfo){
        return {error: 'Error while fetching user data.'}
      }
      return userInfo;
    }
    // Error handling for incorrect credentials
    else if (tokenFetch.status == 403){
      console.error({error: 'Wrong credentials.'});
      return {error: 'Wrong username or password. Please try again.'};
    }
    // Error handling for JWT fetching from WP CMS
    else {
      console.error({error: 'Error while fetching the token from CMS.'});
      return {error: 'Error while fetching the token from CMS.'};
    }
  } catch(error){
    console.error({error});
    return {error: 'Error while fetching the token from CMS.'};
  } 
}

// Creates session cookie
export async function createSession(payload: object) {
  try {
    // Creates the session cookie by a POST request to the /cookie API endpoint
    const res = await fetch(process.env.NEXT_PUBLIC_DEPLOY_URL + 'api/cookie', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const session = await res.json()
    return session; 
    } catch (error) {
      console.error('Error logging in:', error);
      return {error};
  }  
} 

// Implements the creation of the session cookie (called from login page component)
export async function login(credentials: {username: string, password: string}) {
  try {
    // Fetches a session payload from createToken function
    const token = await createToken(credentials.username, credentials.password);
    // Error handling if createToken does not return an encrypted token (string) but an error object
    if ('error' in token){
      return {error: `${token.error}`};
    }
    // Encrypts the payload and creates session cookie in createSession function
    const session = await createSession(token);
    return session; 
    } catch (error) {
      console.error('Error logging in:', error);
      return {error: 'Internal Server Error'};
  }
}

// Gets session server side to apply conditional visuals to header
export async function deleteSession() {
  try {
    // Creates the session cookie by a POST request to the /cookie API endpoint
    const res = await fetch(process.env.NEXT_PUBLIC_DEPLOY_URL + 'api/cookie', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const session = await res.json()
    return session; 
  } catch (error) {
    console.error('Error logging out:', error);
    return {error};
  }
  
} 
