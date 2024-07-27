// Imports React Hooks
import { useEffect, useState } from 'react';

// Declares expected API response for a single product
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number,
    count: number
  }[];
}

// Declares expected structure of PRODUCT_CATEGORIES array (in components)
export interface CategoryWithImages {
  label: string;
  slug: string;
  info: {
    name: string;
    href: string;
    image: string;
  }[];
}

const fetchCategoriesAndCreateObject = () => {
  // Hooks are called at the top of the function before the return statement
  const [categoriesWithImages, setCategoriesWithImages] = useState<CategoryWithImages[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetches categories from the API in an array of strings
        const categoryResponse = await fetch('https://fakestoreapi.com/products/categories');
        const categories: string[] = await categoryResponse.json();
        // Fetches 3 products for each fetched category above
        const categoriesData = await Promise.all(categories.map(async (category) => {
          const imageResponse = await fetch(`https://fakestoreapi.com/products/category/${category}?limit=3`);
          const products: Product[] = await imageResponse.json();
          // Returns an array of objects with the expected CategoriesWithImages structure
          return {
            label: category,
            slug: category.toLowerCase(),
            info: [
              {
                name: 'Trending',
                href: `/products/${category.toLowerCase()}`,
                image: products[0].image,
              },
              {
                name: 'New Arrivals',
                href: `/products/${category.toLowerCase()}`,
                image: products[1].image,
              },
              {
                name: 'Top Sellers',
                href: `/products/${category.toLowerCase()}`,
                image: products[2].image,
              },
            ],
          };
        }));

        setCategoriesWithImages(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        return ({error: 'Unexpected error while fetching default product categories.'})
      }
    };

    fetchData();
  }, []);

  return categoriesWithImages;
};

export default fetchCategoriesAndCreateObject;

// Fetches all products from fake store API
const fetchDefaultProducts = () => {
  const [defaultProducts, setDefaultProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch('https://fakestoreapi.com/products');
        const products:Product[] = await productResponse.json();
        setDefaultProducts(products)
      } catch (error) {
        console.error('Error fetching data:', error);
        return {error: 'Unexpected error while fetching default products.'}
      }
    }

    fetchData();
  }, []);

  return defaultProducts
};

export { fetchDefaultProducts };

