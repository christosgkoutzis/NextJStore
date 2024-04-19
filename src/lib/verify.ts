  export async function verify(token: string) {
    console.log('token for verification:', token)
    // Validates a JWT token in WP headless CMS
    const validated = await fetch(process.env.NEXT_PUBLIC_JWT_BASE + 'token/validate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    console.log('validated: ', validated.status)
    if(validated.status == 200){
      return 200;
    }
    else{
      console.error('Error validating the token.')
      return ('Error validating the token');
    }
  }
