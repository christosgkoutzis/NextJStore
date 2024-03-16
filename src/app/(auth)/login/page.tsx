'use client'

import ErrorAlert from '@/components/ErrorAlert'
import SuccessAlert from '@/components/SuccessAlert'
import { Icons } from '@/components/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { login } from '@/lib/session'

const Page = () => {
  
const [username, setUsername] = useState(String);
const [password, setPassword] = useState(String);
const [formSubmitted, setFormSubmitted] = useState(Boolean);
const [hasErrors, sethasErrors] = useState('');

// Function that handles the incorrect submits of the form
const clientErrors = () => {
  if (!username || !password){
    sethasErrors('All input fields are required to be filled.') 
    return true;
  }
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
  const loginResult = await login({username, password});
  // If it's a string, it holds the error message else it's a number holding the user id (register.ts)
  if (loginResult.error){
    sethasErrors(loginResult.error);
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
    const timer = setTimeout(() => { redirect('/')}, 5000);
    return () => {
      clearTimeout(timer)
     }
  }
}, [formSubmitted, hasErrors]);

  return (
    <> 
    <div className="container relative flex pt-12 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      {(formSubmitted) ? (( hasErrors == '') ? <SuccessAlert successMessage='User logged in successfully. Redirecting to homepage.' /> : <ErrorAlert errorMessage={hasErrors} />)  : null}
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.site_logo className='h-20 w-20'/>
          <h3 className="text-2xl font-bold">Welcome to NextJStore</h3>
        </div>
        <div className="grid gap-6">
          <form onSubmit= {handleSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='username'>Username</Label>
                <Input id='username' name='username' className={cn({'focus-visible:ring-red-500': hasErrors })} placeholder='Johndoe' type='text' value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='password'>Password</Label>
                <Input id='password' name='password' className={cn({'focus-visible:ring-red-500': hasErrors })} placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
              </div>
              <Button type="submit" className='mt-6 mb-6'>Log in</Button>
            </div>
          </form>
          <Link className={buttonVariants({
            variant: 'link',
            className: 'gap-1.5'})} 
            href='sign-in'>
            Forgot your password? Recover it here.  
          </Link>
        </div>
      </div>
    </div>
  </>
  ) 
} 

export default Page