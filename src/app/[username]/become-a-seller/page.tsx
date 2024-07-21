'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/components/icons'
import { usePathname, useRouter } from 'next/navigation'
import SuccessAlert from '@/components/SuccessAlert'
import ErrorAlert from '@/components/ErrorAlert'
import { sellerApplication } from '@/lib/mailer/sellerApplication'

const Page = () => {
  const router = useRouter();
  const [formSubmitted, setFormSubmitted] = useState(Boolean);
  const [name, setName] = useState(String);
  const [description, setDescription] = useState(String);
  const [termsAccepted, setTermsAccepted] = useState(Boolean);
  const [hasErrors, sethasErrors] = useState('');
   // Gets dynamic pathname from hook (/[username]/my-products)
   const pathname = usePathname();
   // Extract the username part of the path by spliting the pathname string to an array of strings using the "/" character as a dividing point
   const username = pathname.split('/')[1];

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setFormSubmitted(true);
    try {
      // Sends email to nextjstore@gmail.com with the application
      const submitResult = await sellerApplication(name, username, description);
      if ("error" in submitResult){
        sethasErrors(submitResult.error)
      }
      else{
        sethasErrors('');
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      sethasErrors('Unexpected error while submitting the product');
      return {error};
    }
  }

  useEffect(() => {
    // Reset formSubmitted to false after 2.5 seconds if hasErrors log isn't empty
    if (formSubmitted && hasErrors !== '') {
      const timer = setTimeout(() => {
        setFormSubmitted(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
    else if (formSubmitted && hasErrors === '') {
      const timer = setTimeout(() => { router.push('/')}, 4000);
      return () => {
        clearTimeout(timer)
       }
    }
  }, [formSubmitted, hasErrors]);

  return (
    <>
      <div className="container relative flex pt-12 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[800px]">
          {(formSubmitted) ? (( hasErrors == '') ? <SuccessAlert successMessage='Application submitted successfully. It will soon be checked by our administration team.' /> : <ErrorAlert errorMessage={hasErrors} />)  : null}
          <div className="flex flex-col py-3">
            <div className='justify-center flex'>
              <Icons.site_logo className='h-[100px] w-[100px]'/>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold border-b p-7 text-slate-800 mt-5">Become a NextJSeller</h3>
            </div>    
          </div>
          <div className="grid gap-6">
            <form onSubmit= {handleSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor='name'>Full Name</Label>
                  <Input id='name' name='name' placeholder='John Doe' value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor='description'>Why do you want to become a NextJSeller ?</Label>
                  <Textarea id='description' name='description' placeholder='I want to become a NextJSeller because...' value={description} onChange={(e) => setDescription(e.target.value)} required />
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
                      You agree to the application's terms and notify the NextJStore's administration team for your application through email.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button type="submit" className='mt-6 mb-6 md:w-3/4 w-full'>Apply</Button>
                </div>
              </div>
            </form>
          </div>     
        </div>
      </div>
    </>
  )
}

export default Page