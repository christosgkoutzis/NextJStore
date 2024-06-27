"use client"

import { currencyFormat } from "@/lib/utils";
import { Button } from "./ui/button";
import { MailWarning, Plus, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import ProductDetails from "./ProductDetails";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { wp_fetch } from "@/lib/wp-fetch";
import { useRouter } from 'next/navigation'



// Defines type of NavItemsProps interface (essential for TS)
export interface ProductCardProps {
  variant: string;
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  seller: string | null;
  status?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ variant, id, title, price, category, image, description, seller, status }) => {
  const router = useRouter();
  const deleteProduct = async (productId: number) => {
    try {
      const res = await wp_fetch(`products/${productId}`, 'DELETE');
      const json = await res.json();
      return json;
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
  return(
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-80 p-4">
      <Link href='#'>
        <img src={image} alt={title} className='h-80 sm:h-60 w-full hover:scale-105 transition-scale duration-300 cursor-pointer' style={{ maxWidth: '100%', maxHeight: '100%' }}/>
      </Link>
      <div className="p-3 flex flex-col gap-2 w-full">
        <Link href={`/products/${id}`}>
          <p className="truncate text-lg font-semibold text-slate-700">{title}</p>
        </Link>
        {// Variant refers to /products route
        variant === 'products' ?
          <>
            <div className="flex items-center gap-1">
              <User className="w-8 h-8" />
              <p className="text-sm text-gray-600 truncate w-full">{seller}</p>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-8 h-8" />
              <p className="text-sm text-gray-600 truncate w-full">{category}</p>
            </div>
          </>
          // Variant is equal with a username (refers to /[username]/my-products dynamic route) 
          :
          <>
            <div className="flex items-center gap-1">
              <MailWarning className="w-8 h-8" />
              {
                (status === "accepted") ?
                <p className="text-sm text-green-600 truncate w-full">{status}</p> 
                : (status === "pending") ?
                <p className="text-sm text-orange-600 truncate w-full">{status}</p>
                :
                <p className="text-sm text-red-600 truncate w-full">{status}</p>
              }
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-8 h-8" />
              <p className="text-sm text-gray-600 truncate w-full">{category}</p>
            </div>
          </>
        }
        <p className="text-rose-400 mt-2 font-semibold">{currencyFormat(price)}</p>
      </div> 
      <div className="text-slate-600 flex justify-between w-full mx-0 items-center">
        <div className="flex items-center flex-grow w-full lg:w-1/2 order-2">
            {(variant === 'products') ?
              <Button variant='default' className="flex items-center justify-center">
                <Plus className="w-4 h-4 mr-1" />
                <p>Add to cart</p>
              </Button>
            :
              <Dialog>
                <DialogTrigger>
                  <Button variant='default' className="flex items-center justify-center">
                    <p>Delete Product </p>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this product? You will not be able to retrieve the product after this step.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button type="submit" onClick={() => {deleteProduct(id); router.refresh()}}>Yes</Button>
                    <DialogClose>
                      <Button variant="outline">No</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
        </div>
        <div className="flex items-center justify-center flex-grow w-full lg:w-1/2 order-1">
          {/* Used the 3dots (spread operators) to avoid declaring each prop individually as key/value pair */}
          <ProductDetails {...{ title, price, category, image, description, seller }} />
        </div>
      </div>
    </div>
  )
}

export default ProductCard;