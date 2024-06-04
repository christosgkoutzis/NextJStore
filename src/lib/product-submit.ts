const productSubmit = async (name: string, description: string, price: number, category: string, image: number) => {
  try {
    const cookie = await fetch(process.env.NEXT_PUBLIC_DEPLOY_URL + 'api/cookie', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const session = await cookie.json();
    if (session){
      // If the user has a role of seller according to custom user roles of CMS
      if (session.role === 'author'){
        const token = session.token;
        const body =
            {
              acf: {
                  user: session.id,
                  name,
                  description,
                  price_in_usd: price,
                  category,
                  image,
              }
            }
        const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + 'products', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (res.ok){
          const result = await res.json();
          console.log(result)
          return result;
        }
        else{
          return {error: 'Unexpected error while uploading the product in database.'}
        }
      }
      else{
      return {error: 'User not authorized for selling products on NextJStore.'}
      }
    }
    else{
      return {error: 'User session invalid or expired. Please log in and try again.'}
    }
  } catch (error) {
    console.error('Error submitting product:', error);
    return {error};
  }
}

export default productSubmit;