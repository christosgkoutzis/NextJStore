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
}

// Declares expected structure of PRODUCT_CATEGORIES array (in components)
interface CategoryWithImages {
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
          const images: Product[] = await imageResponse.json();
          // Returns an array of objects with the expected CategoriesWithImages structure
          return {
            label: category,
            slug: category.toLowerCase(),
            info: [
              {
                name: 'Trending',
                href: '#',
                image: images[0].image,
              },
              {
                name: 'New Arrivals',
                href: '#',
                image: images[1].image,
              },
              {
                name: 'Top Sellers',
                href: '#',
                image: images[2].image,
              },
            ],
          };
        }));

        setCategoriesWithImages(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return categoriesWithImages;
};

export default fetchCategoriesAndCreateObject;