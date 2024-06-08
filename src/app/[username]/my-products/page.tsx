"use client"

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductCards from "@/components/ProductCards"
import { usePathname } from 'next/navigation'

const Page = () => {
  // Gets dynamic pathname from hook (/[username]/my-products)
  const pathname = usePathname();
  // Extract the username part of the path by spliting the pathname string to an array of strings using the "/" character as a dividing point
  const username = pathname.split('/')[1];
  console.log('username:', username) 
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <h3 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">My Products</h3>
          <ProductCards variant={username}/>
        </div>    
      </div>
    </MaxWidthWrapper>
  )
}

export default Page;