// Hook that allows to add-remove items and clear the cart
import { DetailsSchemaProps } from '@/components/ProductDetails'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Declaring cart item's type structure for TS
export type CartItem = {
  product: DetailsSchemaProps
}

// Declaring custom hook's features
type Cart = {
  items: CartItem[]
  addItem: (product: DetailsSchemaProps) => void
  removeItem: (productId: number) => void
  clearCart: () => void
}

// Creates a Cart type global state with zustand's create()
export const useCart = create<Cart>()(
  // Persist keeps the consistency of the state when reloading the app by saving the state in local storage
  persist(
      // set method updates state
      (set) => ({
        items: [],
        addItem: (product) => set((state) => {
          // Returns previous items with the new product
          return { items: [...state.items, { product }] }
        }),
        removeItem: (id) => set((state) => ({
          // Removes the product with the predefined id using filter method
          items: state.items.filter((item) => item.product.id !== id )
        })),
        clearCart: () => set({items: []})
      // Configuration object of persist method that saves the cart to local storage
      }), {name: 'cart', storage: createJSONStorage(() => localStorage)}    
  )
)