import { useState } from "react";
import { currencyFormat } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Plus, ShoppingBag, User } from "lucide-react";
import AddToCart from "./AddToCart";


export interface DetailsSchemaProps {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  seller: string | null;
}

const ProductDetails: React.FC<DetailsSchemaProps> = ({ id, title, price, category, image, description, seller }) => {

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='link' className="text-slate-500">View details</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[80vw] h-[90vh] lg:max-w-[60vw] lg:h-[80vh] flex items-stretch">
          <div className="bg-white rounded-md p-7 h-full w-full group-hover:opacity-75 px-5 flex-1">
            <img src={image} alt={title} className='h-full w-full hover:scale-105 transition-scale duration-300' />          
          </div>
          <div className="flex justify-around flex-col flex-1">
            <DialogTitle className="text-left">
              {title}
            </DialogTitle>
            <DialogDescription className="text-left">
              {description}
            </DialogDescription>
            <div className="flex items-stretch justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <User className="w-8 h-8" />
                  <p className="text-sm text-gray-600 truncate w-full">{seller}</p>
                </div>
                <div className="flex items-start gap-1">
                  <ShoppingBag className="w-8 h-8" />
                  <p className="text-sm text-gray-600 truncate w-full">{category}</p>
                </div>
                <span className="text-xl">{currencyFormat(price)}</span>
              </div>
              <div className="self-end">
                <AddToCart product={{ id, title, price, category, image, description, seller }}/>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='link' className="text-slate-500">View details</Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col justify-around">
        <DrawerHeader>
          <DrawerTitle className="text-center">{title}</DrawerTitle>
          <DrawerDescription className="text-center">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="bg-white rounded-md p-7 group-hover:opacity-75 px-5 w-full h-[40vh] sm:h-[50vh] relative">
          <img src={image} alt={title} className='hover:scale-105 transition-scale duration-300 w-full max-h-full' />          
        </div>
        <DrawerFooter className="pt-2">
          <div className="flex justify-between items-stretch">
            <div>
              <div className="flex items-center gap-1">
                <User className="w-8 h-8" />
                <p className="text-sm text-gray-600 truncate w-full">{seller}</p>
              </div>
              <div className="flex items-start gap-1">
                <ShoppingBag className="w-8 h-8" />
                <p className="text-sm text-gray-600 truncate w-full">{category}</p>
              </div>
            </div>
            <span className="text-xl self-end">{currencyFormat(price)}</span>
          </div>
          <DrawerClose>
            <Button variant="outline" className="w-full">Hide details</Button>
          </DrawerClose>
          <AddToCart product={{ id, title, price, category, image, description, seller }}/>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductDetails;