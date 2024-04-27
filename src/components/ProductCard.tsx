"use client"

import { currencyFormat } from "@/lib/utils";
import { Button } from "./ui/button";
import { Link, ShoppingBag, User } from "lucide-react";


// Defines type of NavItemsProps interface (essential for TS)
interface ProductCardProps {
  title: string;
  price: number;
  category: string;
  image: string;
  seller: string | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, price, category, image, seller }) => {
  return(
    <>
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-80 p-4">
        {/* The following needs to be wrapped to a link element leading to product details page */}
        <img src={image} alt={title} className='h-80 sm:h-60 w-full object-cover hover:scale-105 transition-scale duration-300 cursor-pointer'/>
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">{title}</p>
          <div className="flex items-center gap-1">
            {/*User icon here */}
            <User className="w-8 h-8" />
            <p className="text-sm text-gray-600 truncate w-full">{seller}</p>
          </div>
          <div className="flex items-center gap-1">
            {/*User icon here */}
            <ShoppingBag className="w-8 h-8" />
            <p className="text-sm text-gray-600 truncate w-full">{category}</p>
          </div>
          <p className="text-rose-400 mt-2 font-semibold">{currencyFormat(price)}</p>
        </div> 
        <div className="text-slate-600 flex gap-4">
          <Button variant='secondary'>Add to cart</Button>
        </div>
      </div>
    </>
  )
}

export default ProductCard;