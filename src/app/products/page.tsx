"use client"

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductCards from "@/components/ProductCards"

const Page = () => {
  
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <h3 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">NextJShopping was never easier...</h3>
          <ProductCards variant='products'/>
        </div>    
      </div>
    </MaxWidthWrapper>
  )
}

export default Page;