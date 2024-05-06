'use client'
import { useState, useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Icons } from '@/components/icons'

const Page = () => {
  const [formSubmitted, setFormSubmitted] = useState(Boolean);
  const [name, setName] = useState(String);
  const [description, setDescription] = useState(String);
  const [price, setPrice] = useState(String);
  const [category, setCategory] = useState(String);
  const [file, setFile] = useState(String);
  const [image, setImage] = useState(String);
  const [termsAccepted, setTermsAccepted] = useState(Boolean);


  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setFormSubmitted(true);
  }

  return (
    <>
      <div className="container relative flex pt-12 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[800px]">
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
                  <Input id='price' name='price' type='number' min='0' step='0.01' placeholder='0.00' value={price} onChange={(e) => setPrice(e.target.value)} required/>
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
                        <SelectItem value="jewlery">Jewlery</SelectItem>
                        <SelectItem value="men_clothing">Men's Clothing</SelectItem>
                        <SelectItem value="women_clothing">Women's Clothing</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor='description'>Product's File (Optional)</Label>
                  {/* To determine how to upload files to CMS */}
                  <Input id='file' name='file' type='file' value={file} onChange={(e) => setFile(e.target.value)} />
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor='description'>Product's Image</Label>
                  {/* To determine how to upload files to CMS */}
                  <Input id='image' name='image' type='file' value={image} onChange={(e) => setImage(e.target.value)} />
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