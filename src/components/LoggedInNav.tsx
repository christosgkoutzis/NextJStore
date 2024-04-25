"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { UserInfo, deleteSession } from "../session"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

// The component accepts as props the user object from Header parent component
const LoggedInNav = ({user}: {user: UserInfo}) => {

  const {logout} = useAuth()

  return (
  <DropdownMenu>
    <DropdownMenuTrigger asChild className="overflow-visible">
      <Button variant='ghost' size='sm' className='relative'>My account</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-white w-80" align="end">
      <div className="flex items-center justify-start gap-2 p-2">
        <div className="flex flex-col space-y-0.5 leading-none">
          <p className="font-medium text-sm text-black">{user.email}</p>
        </div>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href='/my-products'>Products for sale</Link>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={logout} className="cursor-pointer">
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default LoggedInNav