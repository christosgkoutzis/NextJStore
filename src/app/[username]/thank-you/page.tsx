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
import { sellerAppAndReview } from '@/lib/mailer/sellerAppAndReview'

const Page = () => {
  const router = useRouter();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [hasErrors, sethasErrors] = useState('');
   // Gets dynamic pathname from hook (/[username]/my-products)
   const pathname = usePathname();
   // Extract the username part of the path by splitting the pathname string to an array of strings using the "/" character as a dividing point
   const username = pathname.split('/')[1];

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setFormSubmitted(true);
    try {
      // Sends email to nextjstore@gmail.com with the application
      const submitResult = await sellerAppAndReview(name, username, description, 'User Review');
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
          {(formSubmitted) ? (( hasErrors == '') ? <SuccessAlert successMessage='Review submitted successfully. It will soon be checked by the administration team.' /> : <ErrorAlert errorMessage={hasErrors} />)  : null}
          <div className="flex flex-col py-3 items-center">  {/* Centering the parent div */}
            <div className='justify-center flex'>
              <Icons.site_logo className='h-[100px] w-[100px]'/>
            </div>
            <div className='text-center'>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold p-4 text-slate-800 mt-5">Thank you for using NextJStore!</h3>
              <p className="mt-6 sm:text-md md:text-lg max-w-prose text-muted-foreground border-b p-2 mx-auto">Please leave a quick review on your experience to help us become better</p> {/* Added mx-auto */}
            </div>    
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor='name'>Full Name</Label>
                  <Input id='name' name='name' placeholder='John Doe' value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor='description'>How was your user experience on NextJStore (mention both positive and negative points) ?</Label>
                  <Textarea id='description' name='description' placeholder='My experience after using NextJStore was...' value={description} onChange={(e) => setDescription(e.target.value)} required />
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
                      You agree to notify the NextJStore's administration team for your review through email.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button type="submit" className='mt-6 mb-6 md:w-3/4 w-full md:my-10'>Submit</Button>
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
