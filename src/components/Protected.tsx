import { verify } from "@/lib/verify";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Defines routes that are protected if there is a session
const sessionProtected = ['/login']

export default function Protected(Component: any) {
  return function Protected(props: any) {
    // Gets current pathname
    const router = useRouter();
    const pathname = usePathname();
    const [verified, setVerified] = useState<string | number>();
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
      async function verifyToken() {
        try {
          // Gets JWT token (stringfied) from cookie
          const res = await fetch(process.env.NEXT_PUBLIC_DEPLOY_URL + 'api/cookie', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const json = await res.json();
          // Checks if the response gave back the token and verifies it to CMS 
          if (json.token) {
            const decryptedToken = json.token;
            const result = await verify(decryptedToken);
            setVerified(result);
          } else {
            setVerified('Incorrect token format.');
          }
        } catch (error) {
          console.error('Error during token verification:', error);
          setVerified('Error during token verification.');
        } finally {
          setLoading(false); // Set loading to false when verification is complete
        }
      }
      verifyToken();
    }, []);

    // Ensures that the redirection is triggered after the state has been updated
    useEffect(() => {
      if (!loading) { // Check if loading is false
        // Redirects to login for session protected routes
        if (typeof verified === 'string') {
          router.push('/login');
        }
        // Redirects to index for no-session protected routes
        else if (typeof verified === 'number') {
          if (sessionProtected.includes(pathname)) {
            router.push('/');
          }
        }
      }
    }, [verified, loading, router, pathname]);

    if (loading) { // Render null while loading
      return null;
    }

    return <Component {...props} />;
  }
}









/*"use client"

import { verify } from "@/lib/verify";
import { useRouter,usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Defines routes that are protected if there is a session
const sessionProtected = ['/login']

export default function Protected(Component: any){
  return function Protected(props: any){
    // Gets current pathname
    const router = useRouter()
    const pathname = usePathname()
    const [verified, setVerified] = useState<string | number>();

    useEffect(() => {
      async function verifyToken() {
        try {
          // Gets JWT token (stringfied) from cookie
          const res = await fetch(process.env.NEXT_PUBLIC_DEPLOY_URL + 'api/cookie', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const json = await res.json();
          // Checks if the response gave back the token and verifies it to CMS 
          if (json.token){
            const decryptedToken = json.token;
            const result = await verify(decryptedToken);
            setVerified(result);
          } else {
            setVerified('Incorrect token format.');
          }
        } catch (error) {
          console.error('Error during token verification:', error);
          setVerified('Error during token verification.');
        }
      }
      verifyToken();
    }, []); 

    // Ensures that the redirection is triggered after the state has been updated
    useEffect(() => {
      console.log(verified)
      // Redirects to login for session protected routes
      if(typeof verified === 'string'){
        console.log(verified)
        router.push('/login');
      }
      // Redirects to index for no-session protected routes
      else if(typeof verified === 'number') {
        if (sessionProtected.includes(pathname)){
          router.push('/');
        } 
      } 
    }, [verified, router, pathname, sessionProtected]);

    if(typeof verified === 'string'){
      return null;
    } 

    return <Component {...props} />;
  }
} */
