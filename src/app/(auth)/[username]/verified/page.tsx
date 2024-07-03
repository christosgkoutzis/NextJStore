'use client'

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { wp_fetch } from "@/lib/wp-fetch";
import { verify } from "@/lib/verify";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react'

const Verified = () => {
  // Declares state of page's text
  const [verified, setVerified] = useState(String);
  const [buttonText, setButtonText] = useState(String);
  const [buttonRedirect, setButtonRedirect] = useState(String);

  // Fetches token and user's id URL params
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');

    // function that verifies the user's account
    async function isVerified() {
      if (typeof token === 'string'){
        const wpVerified = await verify(token);
        if (typeof wpVerified == 'string'){
          setVerified(wpVerified);
          setButtonText('Return to register form');
          setButtonRedirect('/register');
        }
        else {
          try {
            // Authenticates the user in WP CMS user database
            const authenticated = await wp_fetch(`users/${id}?roles=subscriber`,'PUT', {'roles': 'subscriber'});
            // Deletes temporary session from /verify API route
            const res = await fetch(process.env.NEXT_PUBLIC_DEPLOY_URL + 'api/cookie', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            if(authenticated.id){
              if(res.ok){
                setVerified('Your registration to NextJStore has been verified.');
                setButtonText('Please return to homepage and login with your account.');
                setButtonRedirect('/');
              }
              else{
                setVerified('Error deleting temporary session.');
                setButtonText('Try verifying your account later.');
                setButtonRedirect('/');
              }
            }
          } catch (error) {
            setVerified('Error while communicating with user database. Please try again.');
            setButtonText('Return to register form');
            setButtonRedirect('/register');
          }
        }
      }
      return false; 
    }

    // Runs isVerified() function after the component renders
    useEffect(() => {
      isVerified()
    })
  // Returns verification result in XML 
  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-700 sm:text-5xl">
          {verified}
        </h1>
        <p className="mt-6 text-lg max-w-prose text-muted-foreground">
          {buttonText}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {/* buttonVariants() applies default styles of the button component. With parameters, the styles change */}
          <Link href={buttonRedirect} className={buttonVariants()}>
            Return
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
} 

export default Verified;