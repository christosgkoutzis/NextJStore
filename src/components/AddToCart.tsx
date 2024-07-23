'use client'

import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { DetailsSchemaProps } from "./ProductDetails"

const AddToCart = ({product}: {product: DetailsSchemaProps}) => {
  // Calls addItem function from useCart custom hook
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState<boolean>(false);
  // Triggers when we press the button and gives feedback on successful addition to cart
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAdded(false)
    }, 2000);

    return () => clearTimeout(timeout)
  }, [isAdded])

  return (
    <Button onClick={() => {addItem(product); setIsAdded(true)}} variant='default' className={cn("flex items-center justify-center", {"bg-opacity-50" : isAdded})}>
      <Plus className="w-4 h-4 mr-1" />
      {isAdded ? 'Added!' : 'Add to Cart'}
    </Button>
  )
}

export default AddToCart;