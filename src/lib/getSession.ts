import { decrypt } from "@/session";
import { cookies } from "next/headers";

// Gets session server side to apply conditional visuals to header
export async function getSession() {
  const session = cookies().get("session")?.value
  // Decrypts session token and returns it back to middleware
  if (session){
    const decryptedCookie = await decrypt(session);
    return decryptedCookie
  }
  else{
    console.error('Note: Session cookie not found');
    return null
  }
} 



