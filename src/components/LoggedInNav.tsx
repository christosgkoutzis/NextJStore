"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { UserInfo } from "../session"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

// The component accepts as props the user object from Header parent component
const LoggedInNav = ({user}: {user: UserInfo}) => {
  
  // Custom hook that logs out the user
  const {logout} = useAuth()
  
  return (
  <DropdownMenu>
    <DropdownMenuTrigger asChild className="overflow-visible">
      <Button variant='ghost' size='sm' className='relative'>My account</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-white w-80" align="end">
      <div className="flex items-center justify-start gap-2 p-2">
        <div className="flex flex-col space-y-0.5 leading-none">
          <p className="font-medium text-sm text-black">Hello, {user.username}</p>
        </div>
      </div>
      <DropdownMenuSeparator />
      {// My products and sell a product options appear only on seller accounts
        (user.role === 'author') ? (
        <>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={`${user.username}/my-products`}>My products</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={`${user.username}/sell`}>Sell a Product</Link>
          </DropdownMenuItem>
        </>
      )
      // Become a seller option appears only to verified non-seller users
      : (user.role === 'subscriber') ? (
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href={`${user.username}/become-a-seller`}>Become a Seller</Link>
      </DropdownMenuItem>
      ) : null
      }
      <DropdownMenuItem onClick={logout} className="cursor-pointer">
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default LoggedInNav