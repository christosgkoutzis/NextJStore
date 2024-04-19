'use client'

import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { Icons } from '@/components/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
// useRouter for inner navigation in client components
import { useRouter } from 'next/navigation'
import { wp_fetch } from '@/lib/wp-fetch'
import { encrypt, infoFetch } from '@/session'
import { sendEmail } from '@/lib/mailer/mailer'
import { Checkbox } from '@/components/ui/checkbox'

const Page = () => {
// Declaring hooks at the top of page function components to avoid conflicts
const router = useRouter()
const [email, setEmail] = useState(String);
const [termsAccepted, setTermsAccepted] = useState(Boolean);
const [formSubmitted, setFormSubmitted] = useState(Boolean);
const [hasErrors, sethasErrors] = useState(String);

// Function that handles the incorrect submits of the form
const clientErrors = () => {
  if (!email){
    sethasErrors('Input field is required to be filled.') 
    return true;
  }
  // Checks if terms checkbox is checked
  if (!termsAccepted){
    sethasErrors('You must accept our terms and conditions to procceed.')
    return true;
  }
  return false;
}

// Handle form submission
const handleSubmit = async (event: { preventDefault: () => void }) => {
  event.preventDefault()
  // Checks the form for errors
  if (clientErrors()){
    setFormSubmitted(true);
    return false;
  }
  // Calls the login helper function with form values
  const userInfo = await infoFetch(email, 'forgot-password');
  if('error' in userInfo){
    setFormSubmitted(true);
    sethasErrors(userInfo.error);
    return false;
  }
  const token = await encrypt(userInfo)
  const mailer = await sendEmail(userInfo.username, email, 'FORGOT', token)
  if(token && mailer){
    const res = await fetch(process.env.NEXT_PUBLIC_DEPLOY_URL + 'api/cookie', {
      method: 'POST',
      body: JSON.stringify(token),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const session = await res.json()
    setFormSubmitted(true);
    sethasErrors('');
    return true;
  }
  else{
    setFormSubmitted(true);
    sethasErrors('Error creating token and sending verification email. Please try again later.');
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
  else if (formSubmitted && hasErrors === '') {
    const successTimer = setTimeout(() => { 
      router.push('/'); 
    }, 5000);
    return () => {
      clearTimeout(successTimer);
     }
  }  
}, [formSubmitted, hasErrors]);

  return (
    <> 
    <div className="container relative flex pt-12 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      {(formSubmitted) ? (( hasErrors == '') ? <SuccessAlert successMessage='Password reset request submitted successfully. Please visit your email inbox to continue.' /> : <ErrorAlert errorMessage={hasErrors} />)  : null}
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.site_logo className='h-20 w-20'/>
          <h3 className="text-2xl font-bold">Welcome to NextJStore</h3>
        </div>
        <div className="grid gap-6">
          <form onSubmit= {handleSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='email'>Email</Label>
                <Input id='email' name='email' className={cn({'focus-visible:ring-red-500': hasErrors })} placeholder='john.doe@example.com' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="items-top flex space-x-2">
                <Checkbox id="terms" checked={termsAccepted} onCheckedChange={() => setTermsAccepted(!termsAccepted)} required/>
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Accept terms and conditions
                  </label>
                  <p className="text-sm text-muted-foreground text-justify">
                    You agree to verify your email through a unique verification link that will be sent to your address.
                  </p>
                </div>
              </div>
              <Button type="submit" className='mt-6 mb-6'>Recover password</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
  ) 
} 

export default Page