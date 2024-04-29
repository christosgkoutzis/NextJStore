import { useState } from "react";
import { currencyFormat } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
import { ProductCardProps } from "@/components/ProductCard";
import { Plus, ShoppingBag, User } from "lucide-react";

interface DetailsSchemaProps {
  title: string;
  price: number;
  image: string;
  seller: string | null;
  category: string;
}

const ProductDetails: React.FC<ProductCardProps> = ({ id, title, price, category, image, description, seller }) => {

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='link' className="text-slate-500">View details</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          <DetailsSchema title={title} price={price} image={image} seller={seller} category={category} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='link' className="text-slate-500">View details</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <DetailsSchema title={title} price={price} image={image} seller={seller} category={category} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Hide details</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductDetails;

const DetailsSchema: React.FC<DetailsSchemaProps> = ({ title, price, image, seller, category }) => {
  return (
    <div className="max-w-screen-lg mx-auto px-5">
      <div className="bg-white rounded-md p-7">
        <img src={image} className="max-w-full max-h-full" alt={title} />
      </div>
      <div>
        <div className="flex gap-5 items-center justify-around">
          <div>
          <div className="flex items-center gap-1">
            <User className="w-8 h-8" />
            <p className="text-sm text-gray-600 truncate w-full">{seller}</p>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingBag className="w-8 h-8" />
            <p className="text-sm text-gray-600 truncate w-full">{category}</p>
          </div>
            <span className="text-xl">{currencyFormat(price)}</span>
          </div>
          <div>
            <Button variant='default' className="flex items-center justify-center">
              <Plus className="w-4 h-4 mr-1" />
              <p>Add to cart</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
