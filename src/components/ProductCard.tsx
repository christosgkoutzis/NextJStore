"use client"

import { currencyFormat } from "@/lib/utils";
import { Button } from "./ui/button";
import { MailWarning, ShoppingBag, User } from "lucide-react";
import ProductDetails from "./ProductDetails";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { wp_fetch } from "@/lib/wp-fetch";
import { useState } from "react";
import AddToCart from "./AddToCart";

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
  const [open, setOpen] = useState(false);
  
  const deleteProduct = async (productId: number) => {
    try {
      const res = await wp_fetch(`products/${productId}`, 'DELETE');
      const json = await res.json();
      return json;
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  const handleClose = async (shouldDelete: boolean) => {
    if (shouldDelete) {
      await deleteProduct(id);
    }
    setOpen(false);
    // router.refresh() does not perform a full page reload but updates server components only
    window.location.reload();
  }

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-80 p-4">
      <img src={image} alt={title} className='h-80 sm:h-60 w-full hover:scale-105 transition-scale duration-300' style={{ maxWidth: '100%', maxHeight: '100%' }}/>
      <div className="p-3 flex flex-col gap-2 w-full">
        <p className="truncate text-lg font-semibold text-slate-700">{title}</p>
        {variant === 'products' ? (
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
        ) : (
          <>
            <div className="flex items-center gap-1">
              <MailWarning className="w-8 h-8" />
              <p className={`text-sm truncate w-full ${status === "accepted" ? "text-green-600" : status === "pending" ? "text-orange-600" : "text-red-600"}`}>{status}</p>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-8 h-8" />
              <p className="text-sm text-gray-600 truncate w-full">{category}</p>
            </div>
          </>
        )}
        <p className="text-rose-400 mt-2 font-semibold">{currencyFormat(price)}</p>
      </div> 
      <div className="text-slate-600 flex justify-between w-full mx-0 items-center">
        <div className="flex items-center flex-grow w-full lg:w-1/2 order-2">
          {variant === 'products' ? (
            <AddToCart product={{ id, title, price, category, image, description, seller }}/>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant='default' className="flex items-center justify-center" onClick={() => setOpen(true)}>
                  <p>Delete Product</p>
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
                  <Button onClick={() => handleClose(true)}>Yes</Button>
                  <Button variant="outline" onClick={() => handleClose(false)}>No</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="flex items-center justify-center flex-grow w-full lg:w-1/2 order-1">
          <ProductDetails {...{id, title, price, category, image, description, seller }} />
        </div>
      </div>
    </div>
  )
}

export default ProductCard;
