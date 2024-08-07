// Client-side rendering to use event handlers
"use client" 

import fetchCategoriesAndCreateObject, { CategoryWithImages } from "@/config/fakeapi-fetch";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import Link from "next/link";

// Defines type of NavItemsProps interface (essential for TS)
interface NavItemProps {
  category: CategoryWithImages;
  handleOpen: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
}

// NavItemProps get active Product Category
const NavItem: React.FC<NavItemProps> = ({ isAnyOpen, category, handleOpen, isOpen }) => {
  // fetchCategoriesAndCreateObject function must be called at the top of a functional component
  const PRODUCT_CATEGORIES = fetchCategoriesAndCreateObject();
  return (
    <div className="flex">
      <div className="relative flex items-center">
        {/* Button that displays current category */}
        <Button className="gap-1.5" onClick={handleOpen} variant={isOpen ? 'secondary' : 'ghost'}>
          {category.label}
        {/* cn function to use conditional classes and ChevronDown from the icon library */}
        <ChevronDown
          className={cn('h-4 w-4 transition-all text-muted-foreground', { '-rotate-180': isOpen })}
        />
        </Button>
      </div>
      {/* If the isOpen is true it applies JSX, else it returns null. Second cn parameter classes apply if isAnyOpen is false */}
      {isOpen ? (
        <div className={cn("absolute inset-x-0 top-full text-sm text-muted-foreground", {"animate-in fade-in-10 slide-in-from-top-5" : !isAnyOpen, })}>
          {/* Decorational div / aria-hidden prevents assistive techs (like screen readers) to access the div */}
          <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />
          <div className="relative bg-white">
            <div className="mx-auto max-w-7xl px-8">
              <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8">
                  {category.info.map((item) => (
                    <div key={item.name} className="group relative text-base sm:text-sm">
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                        <Link href={item.href}>                        
                          <Image src={item.image} alt={item.name} fill className='object-center object-cover' />
                        </Link>
                      </div>
                      <Link href={item.href} className='mt-6 block font-medium text-gray-900'>
                        {item.name}
                        <p className='mt-1 font-normal' aria-hidden='true'>Shop now</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NavItem;
