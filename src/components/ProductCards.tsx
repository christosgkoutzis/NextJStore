"use client"

import { fetchDefaultProducts } from "@/config/fakeapi-fetch";
import { wp_fetch } from "@/lib/wp-fetch";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import productSubmit from "@/lib/product-submit";

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
  const [route, setRoute] = useState<string>(variant);

  useEffect(() => {
    const userProductFetch = async () => {
      try {
        // Fetches all user's products from CMS
        let USER_PRODUCTS: UserProduct[] = await wp_fetch("products?_fields=id,acf", "GET");
        // If the condition is true, the variant is a username and the component is called from [username]/my-products dynamic route
        if (route !== 'products') {
          // Promise.all ensures that all promises are resolved before rendering
          const filteredProducts = await Promise.all(USER_PRODUCTS.map(async (product) => {
            // Replaces user's id with username
            const userfetch = await wp_fetch(`users/${product.acf.user}`, "GET");
            product.acf.user = userfetch.name;
            // Checks if the product is from the logged in user and replaces image's id with its link
            if (product.acf.user === route) {
              const imagefetch = await wp_fetch(`media/${product.acf.image}`, "GET");
              product.acf.image = imagefetch.link;
              return product;
            }
          }));
          // TS guard that ensures that all undefined values are filtered out from the USER_PRODUCT array
          // This line informs TS that product is of type UserProduct if it's not undefined
          USER_PRODUCTS = filteredProducts.filter((product): product is UserProduct => product !== undefined);
          if (USER_PRODUCTS.length == 0){
            setRoute('noUserProducts');
          }
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
  }, [route]);

  return (
    <div className="flex gap-4 p-7 flex-wrap justify-center">
      {route === 'products' ? DEFAULT_PRODUCTS.map((product) => (
        <ProductCard
          variant={route}
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
      { (route === 'noUserProducts') ?
        (
          <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-700 sm:text-5xl">
              You haven't listed a product yet.
            </h1>
            <p className="mt-6 text-lg max-w-prose text-muted-foreground">
              Start selling products on NextJStore clicking the button below
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {/* buttonVariants() applies default styles of the button component. With parameters, the styles change */}
              <Link href={`/${variant}/sell`} className={buttonVariants()}>
                Sell products
              </Link>
            </div>
          </div>
        )
        : (route === 'products') ?
        userProducts.map((product) => (
          (product.acf.status === 'accepted') ?
          <ProductCard
            variant={route}
            key={product.id}
            id={product.id}
            title={product.acf.name}
            price={product.acf.price_in_usd}
            category={product.acf.category}
            image={product.acf.image}
            description={product.acf.description}
            seller={product.acf.user}
            status={product.acf.status}
          /> : null
        ))
        :
        userProducts.map((product) => (
          <ProductCard
            variant={route}
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
        ))
      }
    </div>
  )
}

export default ProductCards;
