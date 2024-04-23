'use client'

import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
// useRouter for inner navigation in client components
import { useRouter, usePathname } from 'next/navigation'
import { wp_fetch } from '@/lib/wp-fetch'
import { infoFetch } from '@/session'


const Page = () => {
// Declaring hooks at the top of page function components to avoid conflicts
const pathname = usePathname()
const router = useRouter();
const [password, setPassword] = useState(String);
const [confirmPassword, setConfirmPassword] = useState(String);
const [formSubmitted, setFormSubmitted] = useState(Boolean);
const [hasErrors, sethasErrors] = useState(String);

// Function that handles the incorrect submits of the form
const clientErrors = () => {
  if (!password || !confirmPassword){
    sethasErrors('All input fields are required to be filled.') 
    return true;
  }
  // Checks if the password and confirm password match
  if (password !== confirmPassword) {
    sethasErrors('Password and confirm password values are not equal.')
    return true;
  }
  // Checks for password length
  if (password.length < 8){
    sethasErrors('Password must be 8 characters or longer.')
    return true;
  }
  return false;
}

// Extracts username from current path
const getUsername = (currentPath: string): string | null => {
  // Define a regular expression pattern to match the value between slashes
  const regex = /\/([^/]+)\/password-reset/;
  // Use the exec() method to find the matches
  const match = regex.exec(currentPath);
  // Check if there is a match and extract the value
  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
};


// Handles form submission
const handleSubmit = async (event: { preventDefault: () => void }) => {
  event.preventDefault()
  // Checks the form for errors
  if (clientErrors()){
    setFormSubmitted(true);
    return false;
  }
  // Gets username value from current path
  const username = getUsername(pathname);
  if(username){
    // Fetches userInfo to get user's id
    const userInfo = await infoFetch(username, 'dummy')
    if (!('error' in userInfo)){
      const id = userInfo.id
      // Calls WP CMS RestAPI to change user's password
      const resetPassword = await wp_fetch(`users/${id}`, 'POST', {password});
      if(resetPassword.id){
        setFormSubmitted(true);
        sethasErrors('');
        // Deletes temporary session
        const res = await fetch(process.env.NEXT_PUBLIC_DEPLOY_URL + 'api/cookie', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const deletedSession = await res.json()
        return true;    
      }
    }
  }
  else{
    setFormSubmitted(true);
    sethasErrors('Internal server error. Please try again.');
    return false;
  }
};

useEffect(() => {
  // Reset formSubmitted to false after 2.5 seconds if hasErrors log isn't empty
  if (formSubmitted && hasErrors !== '') {
    const errorTtimer = setTimeout(() => {
      setFormSubmitted(false);
    }, 2500);
    return () => {
      clearTimeout(errorTtimer)
    }
  }
  // Redirects to index route after 4 seconds
  else if (formSubmitted && hasErrors === '') {
    const successTimer = setTimeout(() => { 
      router.push('/'); 
    }, 4000);
    return () => {
      clearTimeout(successTimer);
     }
  }  
}, [formSubmitted, hasErrors]);

  return (
    <> 
    <div className="container relative flex pt-12 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      {(formSubmitted) ? (( hasErrors == '') ? <SuccessAlert successMessage='Password changed successfully. Redirecting to homepage.' /> : <ErrorAlert errorMessage={hasErrors} />)  : null}
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.site_logo className='h-20 w-20'/>
          <h3 className="text-2xl font-bold">Reset your NextJStore account password</h3>
        </div>
        <div className="grid gap-6">
          <form onSubmit= {handleSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='password'>New Password</Label>
                <Input id='password' name='password' className={cn({'focus-visible:ring-red-500': hasErrors })} placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
              </div>
              <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='confirm-password'>Confirm New Password</Label>
                <Input id='confirm-password' name='confirm-password' className={cn({'focus-visible:ring-red-500': hasErrors })} placeholder='Confirm your Password' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <Button type="submit" className='mt-6 mb-6'>Change password</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
  ) 
} 

export default Page 