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
      image: string,
      status: string,
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
        let USER_PRODUCTS: UserProduct[] = await wp_fetch("products?_fields=id,acf", "GET");
        USER_PRODUCTS.map(async (product) => {
          // Replaces user's id with username accessing user database
          const userfetch = await wp_fetch(`users/${product.acf.user}`, "GET");
          product.acf.user = await userfetch.name;
          // Replaces image's id with image's link from CMS
          const imagefetch = await wp_fetch(`media/${product.acf.image}`, "GET");
          product.acf.image = await imagefetch.link;
        })
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
      return (<ProductCard key={product.id} id={product.id} title={product.title} price={product.price} category={product.category} image={product.image} description={product.description} seller='FakeAPIStore'/>)
    })}
    {(userProducts).map((product) => {
      if(product.acf.status === 'accepted')
        {
          return (<ProductCard key={product.id} id={product.id} title={product.acf.name} price={product.acf.price_in_usd} category={product.acf.category} image={product.acf.image} description={product.acf.description} seller= {product.acf.user}/>)
        }
    })}
  </div>
  )

}

export default ProductCards