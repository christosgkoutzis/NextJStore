'use client'

import { ShoppingBasket } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"

const Cart = () => {
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
    </SheetContent>
</Sheet>
)}
export default Cart