'use client'

import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { Icons } from '@/components/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { register } from '@/lib/register'
import Link from 'next/link'
import { useState, useEffect } from 'react'
// useRouter for inner navigation in client components
import { useRouter } from 'next/navigation'

const Page = () => {
// Declaring hooks at the top of page function components to avoid conflicts  
const router = useRouter()
const [username, setUsername] = useState(String);
const [email, setEmail] = useState(String);
const [password, setPassword] = useState(String);
const [confirmPassword, setConfirmPassword] = useState(String);
const [termsAccepted, setTermsAccepted] = useState(Boolean);
const [formSubmitted, setFormSubmitted] = useState(Boolean);
const [hasErrors, sethasErrors] = useState('');

// Checks if a string is alphanumeric
function isAlphanumeric(str: string): boolean {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(str);
}

// Function that handles the incorrect submits of the form
const clientErrors = () => {
  if (!username || !password || !confirmPassword){
    sethasErrors('All input fields are required to be filled.') 
    return true;
  }
  // Checks if username is alphanumeric
  if (!isAlphanumeric(username)){
    sethasErrors('Username must contain alphanumeric characters only.')
    return true;
  }
  // Checks for username and password length
  if (password.length < 8 || username.length > 10){
    sethasErrors('Password must be 8 characters or longer and username must be no longer than 10 characters.')
    return true;
  }
  // Check if the password and confirm password match
  if (password !== confirmPassword) {
    sethasErrors('Password and confirm password values are not equal.')
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
  sethasErrors('');
  setFormSubmitted(true);
  // Checks the form for errors
  if (clientErrors()){
    return;
  }
  // Calls the register helper function with form values
  const registrationResult = await register({username, email, password });
  // If it's a string, it holds the error message else it's a number holding the user id (register.ts)
  if (registrationResult.error){
    sethasErrors(registrationResult.error);
  }
  else{
    sethasErrors('');
  }
}; 

useEffect(() => {
  // Reset formSubmitted to false after 2.5 seconds if hasErrors log isn't empty
  if (formSubmitted && hasErrors !== '') {
    const timer = setTimeout(() => {
      setFormSubmitted(false);
    }, 2500);
    return () => clearTimeout(timer);
  }
  else if (formSubmitted && hasErrors === '') {
    const timer = setTimeout(() => { router.push('/verified')}, 5000);
    return () => {
      clearTimeout(timer)
     }
  }
}, [formSubmitted, hasErrors]);

  return (
    <> 
    <div className="container relative flex pt-12 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      {(formSubmitted) ? (( hasErrors == '') ? <SuccessAlert successMessage='User registered successfully. Please visit the submitted email to verify it.' /> : <ErrorAlert errorMessage={hasErrors} />)  : null}
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.site_logo className='h-20 w-20'/>
          <h3 className="text-2xl font-bold">Welcome to NextJStore</h3>
          <Link className={buttonVariants({
            variant: 'link',
            className: 'gap-1.5'})} 
            href='login'>
            Already have an account? Sign-in 
          </Link>
        </div>
        <div className="grid gap-6">
          <form onSubmit= {handleSubmit}>
            <div className="grid gap-2">
            <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='username'>Username</Label>
                <Input id='username' name='username' className={cn({'focus-visible:ring-red-500': hasErrors })} placeholder='johndoe' value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='email'>Email</Label>
                <Input id='email' name='email' className={cn({'focus-visible:ring-red-500': hasErrors })} placeholder='john.doe@example.com' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='password'>Password</Label>
                <Input id='password' name='password' className={cn({'focus-visible:ring-red-500': hasErrors })} placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
              </div>
              <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='confirm-password'>Confirm Password</Label>
                <Input id='confirm-password' name='confirm-password' className={cn({'focus-visible:ring-red-500': hasErrors })} placeholder='Confirm your Password' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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
                    You agree to sign up to NextJStore and authenticate your registration through a unique token that will be sent to your email address.
                  </p>
                </div>
              </div>
              <Button type="submit" className='mt-6 mb-6'>Register</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
  ) 
} 

export default Page