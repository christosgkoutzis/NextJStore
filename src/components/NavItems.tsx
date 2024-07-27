// Demands client-side interactivity instead of default server-side
"use client"

import { useEffect, useRef, useState } from "react"
import NavItem from "./NavItem"
import fetchCategoriesAndCreateObject from "@/config/fakeapi-fetch"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import { usePathname } from "next/navigation"

const NavItems = () => {
  // fetchCategoriesAndCreateObject function must be called at the top of a functional component
  const PRODUCT_CATEGORIES = fetchCategoriesAndCreateObject();
  // Typescript generic declaration of state (type null or number with the default value of null) 
  const [activeIndex, setActiveIndex] = useState<null | number>(null)
  const pathname = usePathname()


  // Closes active category if user presses Esc key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if(e.key === 'Escape'){
        setActiveIndex(null)
      }
    }
    // Initiates the keyboard event through an event listener
    document.addEventListener('keydown', handler)
    // Frees memory by removing event listener at the end
    return() => {
      document.removeEventListener('keydown', handler)
    }
  },[])

   // When an item is clicked in the menu and we navigate away, the menu closes
   useEffect(() => {
    setActiveIndex(null)
  }, [pathname])

  // Boolean that checks whether any category is active or not
  const isAnyOpen = activeIndex !== null;
  // Checks if user clicked outside of the navbar through custom hook and sets active category to null
  const navRef = useRef<HTMLDivElement | null>(null)
  useOnClickOutside(navRef, () => setActiveIndex(null))

  return (
    // Assigns custom hook reference to the navbar to implement its functionality
    <div className="flex gap-4 h-full" ref={navRef}>
      {(PRODUCT_CATEGORIES).map((category, id) => {
        // function that keeps track of which product is currently open in the app
        const handleOpen = () => {
          if(activeIndex === id) {
            setActiveIndex(null)
          }
          else {
            setActiveIndex(id)
          }
        }
        // const that holds the active product
        const isOpen = id === activeIndex
        return(
          <NavItem category={category} handleOpen={handleOpen} isOpen={isOpen} key={category.slug} isAnyOpen={isAnyOpen} />
        )
      })}
    </div>
  )
}

export default NavItems 
