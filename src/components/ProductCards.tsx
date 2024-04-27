"use client"

import { fetchDefaultProducts } from "@/config/fakeapi-fetch";
import { wp_fetch } from "@/lib/wp-fetch";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";

// Declares expected API response for a single product
interface UserProduct {
  id: number,
  acf: {
      user: string | null,
      name: string,
      description: string,
      price_in_usd: number,
      category: string,
      files: string | null,
      image: string,
      status: string[],
      "": ""
  }
}

const ProductCards = () => {
  // Gets products from FakeStore API
  const DEFAULT_PRODUCTS = fetchDefaultProducts();
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
  
  useEffect(() => {
    const userProductFetch = async () => {
      // Gets products from users (fetches only product id and ACF info)
      try {
        const USER_PRODUCTS: UserProduct[] = await wp_fetch("products?_fields=id,acf", "GET");
        setUserProducts(USER_PRODUCTS);
      } catch (error) {
        console.error('Error fetching data:', error);
        return {error: 'Unexpected error while fetching user products.'} 
      }
    }
    userProductFetch();
  }, []);

  return(
  <div className="flex gap-4 p-7 flex-wrap justify-center">
    {/* product is a declaration of each object of the DEFULT_PRODUCT response */}
    {(DEFAULT_PRODUCTS).map((product) => {
      return (<ProductCard key={product.id} title={product.title} price={product.price} category={product.category} image={product.image} seller='FakeAPIStore'/>)
    })}
    {(userProducts).map((product) => {
      return (<ProductCard key={product.id} title={product.acf.name} price={product.acf.price_in_usd} category={product.acf.category} image={product.acf.image} seller= {product.acf.user}/>)
    })}
  </div>
  )

}

export default ProductCards