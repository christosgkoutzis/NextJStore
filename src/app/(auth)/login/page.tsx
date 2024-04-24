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
// useRouter for inner navigation in client components
import { useRouter, useSearchParams } from 'next/navigation'
import { login } from '@/session'

const Page = () => {
// Declaring hooks at the top of page function components to avoid conflicts
const router = useRouter()
const searchParams = useSearchParams()
const [username, setUsername] = useState(String);
const [password, setPassword] = useState(String);
const [formSubmitted, setFormSubmitted] = useState(Boolean);
const [hasErrors, sethasErrors] = useState(String);

// Gets from params if the user tries to log in as seller
const seller = searchParams.get("seller")
// UI parameter used to redirect the user in the route they were before signing in
const origin = searchParams.get("origin")

// Functions that change the parameters of /login page to seller mode (or off) changing with onClick event 
const sellerLogin = () => {
  router.push("?seller=true")
}

const customerLogin = () => {
  router.replace("/login", undefined)
}

// Function that handles the incorrect submits of the form
const clientErrors = () => {
  if (!username || !password){
    sethasErrors('All input fields are required to be filled.') 
    return true;
  }
}

// Handles form submission
const handleSubmit = async (event: { preventDefault: () => void }) => {
  event.preventDefault()
  // Checks the form for errors
  if (clientErrors()){
    setFormSubmitted(true);
    return false;
  }
  // Calls the login helper function with form values
  const loginResult = await login({username, password});
  setFormSubmitted(true);
  // If the result includes error keys, renders error message, else sets errors as empty string.
  if (loginResult.error){
    sethasErrors(loginResult.error);
    return false;
  }
  else{
    sethasErrors('');
  } 
  return true;
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
      router.refresh();
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
      {(formSubmitted) ? (( hasErrors == '') ? <SuccessAlert successMessage='User logged in successfully. Redirecting to homepage.' /> : <ErrorAlert errorMessage={hasErrors} />)  : null}
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.site_logo className='h-20 w-20'/>
          <h3 className="text-2xl font-bold">
            {seller? 'Welcome back NextJSeller' : 'Welcome to NextJStore'}
          </h3>
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
          <div className="relative">
            <div aria-hidden='true' className="absolute inset-0 flex items-center">
              <span className='w-full border-t'/>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>
          {seller? (<Button onClick={customerLogin} variant='secondary'>Login as customer</Button>):(<Button onClick={sellerLogin} variant='secondary'>Login as seller</Button>)}
          <Link className={buttonVariants({
            variant: 'link',
            className: 'gap-1.5'})} 
            href='/forgot-password'>
            Forgot your password? Recover it here.  
          </Link>
        </div>
      </div>
    </div>
  </>
  ) 
} 

export default Page;