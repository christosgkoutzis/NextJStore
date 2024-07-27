'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Icons } from '@/components/icons'
import { useRouter } from 'next/navigation'
import SuccessAlert from '@/components/SuccessAlert'
import ErrorAlert from '@/components/ErrorAlert'
import productSubmit from '@/lib/product-submit'

const Page = () => {
  const router = useRouter()
  const [formSubmitted, setFormSubmitted] = useState(Boolean);
  const [name, setName] = useState(String);
  const [description, setDescription] = useState(String);
  const [price, setPrice] = useState(Number);
  const [category, setCategory] = useState(String);
  const [image, setImage] = useState<File>();
  const [termsAccepted, setTermsAccepted] = useState(Boolean);
  const [hasErrors, sethasErrors] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  // Function that uploads files to WP CMS and returns file's URL to CMS Database
  const fileUpload = async (fileToUpload: File) => {
    // File must be uploaded as formdata because it properly handles uploads to WP CMS
    const formdata = new FormData();
    formdata.append('file', fileToUpload);
    // Didn't copy wp_fetch function because of Application header
    const wpAppCredentials = {
      username: process.env.NEXT_PUBLIC_WP_ADMIN_USERNAME,
      password: process.env.NEXT_PUBLIC_WP_REGISTER_APP_PASSWORD,
    };
    const encryptedWpAppCredentials = btoa(`${wpAppCredentials.username}:${wpAppCredentials.password}`);
    // Body does not need stringify because the payload is not an object
    const fileUpload = await fetch(process.env.NEXT_PUBLIC_BASE_URL + 'media', {
      method: 'POST',
      body: formdata,
      headers: {
        'Authorization': `Basic ${encryptedWpAppCredentials}`
      },
    });
  const json = await fileUpload.json();
    const fileID = json.id;
    return fileID;
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setFormSubmitted(true);
    try {
      // ImageLink is mandatory whereas fileLink is not (controlled below from the form fields)
      let imageID = null;
      if (image){
        imageID = await fileUpload(image);
      }
      else{
        console.error('No image file found.');
        sethasErrors('No image file found. Please try again');
        return;
      }
      // Submits the product (custom ACF) to CMS
      const submitResult = await productSubmit(name, description, price, category, imageID);
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
          {(formSubmitted) ? (( hasErrors == '') ? <SuccessAlert successMessage='Product submitted successfully. Please check your inventory for the verification status.' /> : <ErrorAlert errorMessage={hasErrors} />)  : null}
          <div className="flex flex-col py-3">
            <div className='justify-center flex'>
              <Icons.site_logo className='h-[100px] w-[100px]'/>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold border-b p-7 text-slate-800 mt-5">Sell your awesome products on NextJStore</h3>
            </div>    
          </div>
          <div className="grid gap-6">
            <form onSubmit= {handleSubmit}>
              <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                  <Label htmlFor='name'>Product's Name</Label>
                  <Input id='name' name='name' placeholder='My product' value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor='description'>Product's Description</Label>
                  <Textarea id='description' name='description' placeholder='Details about my product...' value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor='price'>Product's Price (€)</Label>
                  {/* Input type for price (step determines the number of decimals) */}
                  <Input id='price' name='price' type='number' min='0' step='0.01' placeholder='0.00' value={price} onChange={(e) => setPrice(e.target.valueAsNumber)} required/>
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor='confirm-password'>Product's Category</Label>
                  <Select value={category} onValueChange={(e) => setCategory(e)} required>
                    <SelectTrigger className="w-full" >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="jewelery">Jewelery</SelectItem>
                        <SelectItem value="men's clothing">Men's Clothing</SelectItem>
                        <SelectItem value="women's clothing">Women's Clothing</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor='description'>Product's Image</Label>
                  <Input id='image' name='image' type='file' onChange={handleImageChange} required/>
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
                      You agree to submit your product to NextJStore and receive a confirmation email to your email address.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button type="submit" className='mt-6 mb-6 md:w-3/4 w-full'>Submit</Button>
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