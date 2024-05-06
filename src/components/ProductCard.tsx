"use client"

import { currencyFormat } from "@/lib/utils";
import { Button } from "./ui/button";
import { Plus, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import ProductDetails from "./ProductDetails";

// Defines type of NavItemsProps interface (essential for TS)
export interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  seller: string | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, category, image, description, seller }) => {

  return(
    <>
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-80 p-4">
        <Link href='#'>
          <img src={image} alt={title} className='h-80 sm:h-60 w-full hover:scale-105 transition-scale duration-300 cursor-pointer' style={{ maxWidth: '100%', maxHeight: '100%' }}/>
        </Link>
        <div className="p-3 flex flex-col gap-2 w-full">
          <Link href={`/products/${id}`}>
            <p className="truncate text-lg font-semibold text-slate-700">{title}</p>
          </Link>
          <div className="flex items-center gap-1">
            <User className="w-8 h-8" />
            <p className="text-sm text-gray-600 truncate w-full">{seller}</p>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingBag className="w-8 h-8" />
            <p className="text-sm text-gray-600 truncate w-full">{category}</p>
          </div>
          <p className="text-rose-400 mt-2 font-semibold">{currencyFormat(price)}</p>
        </div> 
        <div className="text-slate-600 flex justify-between w-full mx-0 items-center">
          <div className="flex items-center flex-grow w-full lg:w-1/2 order-2">
            <Button variant='default' className="flex items-center justify-center">
              <Plus className="w-4 h-4 mr-1" />
              <p>Add to cart</p>
            </Button>
          </div>
          <div className="flex items-center justify-center flex-grow w-full lg:w-1/2 order-1">
            {/* Used the 3dots (spread operators) to avoid declaring each prop individually as key/value pair */}
            <ProductDetails {...{ title, price, category, image, description, seller }} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard;