'use client'

import { Icons } from '@/components/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import Link from 'next/link'
const Page = () => {
  return (
    <> 
    <div className="container relative flex pt-12 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.site_logo className='h-20 w-20'/>
          <h3 className="text-2xl font-bold">Welcome to NextJStore</h3>
          <Link className={buttonVariants({
            variant: 'link',
            className: 'gap-1.5'})} 
            href='sign-in'>
            Already have an account? Sign-in 
          </Link>
        </div>
        <div className="grid gap-6">
          <form>
            <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='email'>Email</Label>
                <Input className={cn({'focus-visible:ring-red-500': true })} placeholder='john.doe@example.com' />
              </div>
              <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='password'>Password</Label>
                <Input className={cn({'focus-visible:ring-red-500': true })} placeholder='Password' />
              </div>
              <div className="grid gap-1 py-2">
                {/* htmlFor is like for in HTML and it assossiates the Label with the Input */}
                <Label htmlFor='password'>Confirm Password</Label>
                <Input className={cn({'focus-visible:ring-red-500': true })} placeholder='Confirm your Password' />
              </div>
              <div className="items-top flex space-x-2">
                <Checkbox id="terms" />
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
              <Button className='mt-6'>Register</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
  ) 
}

export default Page