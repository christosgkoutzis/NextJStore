'use client'

import { Divide, ShoppingBasket } from "lucide-react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Separator } from "./ui/separator"
import { currencyFormat } from "@/lib/utils"
import { buttonVariants } from "./ui/button"
import Link from "next/link"
import Image from "next/image"

const Cart = () => {
  const itemCount = 0
  const fee = 1
return (
/* Sheet component from the UI library */
<Sheet>
  {/* UI library component that triggers the sheet and adds hover styles (through group className) with ShoppingBasket icon from lucide */}
  <SheetTrigger className='group -m-2 flex items-center p-2'>
    <ShoppingBasket className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden='true'/>
    {/* Amount of items that the shopping cart includes */}
    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
      0
    </span>
    </SheetTrigger>
    {/* Holds sheet's inner content */}
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
      <SheetHeader className='space-y-2.5 pr-6'>
        <SheetTitle>Cart (0)</SheetTitle>
      </SheetHeader>
      {/* If there are items in the cart */}
      {itemCount > 0 ? (
      <>
        <div className="flex w-full flex-col pr-6">
          Cart Items
        </div>
        <div className="space-y-4 pr-6">
          {/* UI library ready component */}
          <Separator />
          <div className="space-y-1.5 text-sm">
            <div className="flex">
              <span className="flex-1">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex">
              <span className="flex-1">Transaction Fee</span>
              <span>{currencyFormat(fee)}</span>
            </div>
            <div className="flex">
              <span className="flex-1">Total Price</span>
              <span>{currencyFormat(fee)}</span>
            </div>
          </div>
          <SheetFooter>
            {/* asChild attribute means that everything inside the element will NOT be wrapped in a button element (default behavior) */}
            <SheetTrigger asChild>
              <Link href='/cart' className={buttonVariants({className: 'w-full'})}>Continue to Checkout</Link>
            </SheetTrigger>
          </SheetFooter>
        </div>
      </>) :
      // If there are NOT items in the cart
      (<div className="flex h-full flex-col items-center justify-center space-y-1">
        <div className="relative mb-4 h-60 w-60 text-muted-foreground">
          {/* Open source image from dlf.pt for personal use only */}
          <Image src='/images/empty-shopping-cart.png' fill alt='An empty cart viewed from the side' className="object-cover"/>
        </div>
        <div className="text-xl font-semibold">Your cart is empty</div>
        <SheetTrigger asChild>
          <Link href='/products' className={buttonVariants({
            variant: 'link',
            size: 'sm',
            className: 'text-sm text-muted-foreground'
            })}>
              Add Products to your Cart to proceed to the checkout
            </Link>
        </SheetTrigger>
      </div>)}
    </SheetContent>
</Sheet>
)}
export default Cart