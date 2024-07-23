import { X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { currencyFormat } from "@/lib/utils"
import { DetailsSchemaProps } from "./ProductDetails"

const CartItem = ({product}: {product: DetailsSchemaProps}) => {
  const {removeItem} = useCart()
  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            <img src={product.image} alt={product.title} className="absolute object-cover" />
          </div>
          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">{product.title}</span>
            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">{product.category}</span>
            <div className="mt-4 text-xs text-muted-foreground">
              <button onClick={() => removeItem(product.id)} className="flex items-center gap-0.5 text-red-500">
                <X className='w-3 h-4' />
                Remove
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {currencyFormat(product.price)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartItem