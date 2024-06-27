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

const ProductCards = ({ variant }: { variant: string }) => {
  // Gets products from FakeStore API
  const DEFAULT_PRODUCTS = fetchDefaultProducts();
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);

  useEffect(() => {
    const userProductFetch = async () => {
      try {
        // Fetches all user's products from CMS
        let USER_PRODUCTS: UserProduct[] = await wp_fetch("products?_fields=id,acf", "GET");
        // If the condition is true, the variant is a username and the component is called from [username]/my-products dynamic route
        if (variant !== 'products') {
          // Promise.all ensures that all promises are resolved before rendering
          const filteredProducts = await Promise.all(USER_PRODUCTS.map(async (product) => {
            // Replaces user's id with username
            const userfetch = await wp_fetch(`users/${product.acf.user}`, "GET");
            product.acf.user = userfetch.name;
            // Checks if the product is from the logged in user and replaces image's id with its link
            if (product.acf.user === variant) {
              const imagefetch = await wp_fetch(`media/${product.acf.image}`, "GET");
              product.acf.image = imagefetch.link;
              return product;
            }
          }));
          // TS guard that ensures that all undefined values are filtered out from the USER_PRODUCT array
          // This line informs TS that product is of type UserProduct if it's not undefined
          USER_PRODUCTS = filteredProducts.filter((product): product is UserProduct => product !== undefined);
        // The component is called from /products route
        } else {
          USER_PRODUCTS = await Promise.all(USER_PRODUCTS.map(async (product) => {
            const userfetch = await wp_fetch(`users/${product.acf.user}`, "GET");
            product.acf.user = userfetch.name;
            const imagefetch = await wp_fetch(`media/${product.acf.image}`, "GET");
            product.acf.image = imagefetch.link;
            return product;
          }));
        }
        setUserProducts(USER_PRODUCTS);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    userProductFetch();
  }, [variant]);

  return (
    <div className="flex gap-4 p-7 flex-wrap justify-center">
      {variant === 'products' ? DEFAULT_PRODUCTS.map((product) => (
        <ProductCard
          variant={variant}
          key={product.id}
          id={product.id}
          title={product.title}
          price={product.price}
          category={product.category}
          image={product.image}
          description={product.description}
          seller='FakeAPIStore'
        />
      )) : null}
      {userProducts.map((product) => (
        variant === 'products' ?
          (product.acf.status === 'accepted' && (
            <ProductCard
              variant={variant}
              key={product.id}
              id={product.id}
              title={product.acf.name}
              price={product.acf.price_in_usd}
              category={product.acf.category}
              image={product.acf.image}
              description={product.acf.description}
              seller={product.acf.user}
            />
          ))
          :
          (
            <ProductCard
              variant={variant}
              key={product.id}
              id={product.id}
              title={product.acf.name}
              price={product.acf.price_in_usd}
              category={product.acf.category}
              image={product.acf.image}
              description={product.acf.description}
              seller={product.acf.user}
              status={product.acf.status}
            />
          )
      ))}
    </div>
  )
}

export default ProductCards;
