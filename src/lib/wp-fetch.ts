export async function wp_fetch(endpoint: string, method: string, body: object){
  // Base64 encode the username and application password
  const wpAppCredentials = {
    username: process.env.NEXT_PUBLIC_WP_ADMIN_USERNAME,
    password: process.env.NEXT_PUBLIC_WP_REGISTER_APP_PASSWORD,
  };
  const encryptedWpAppCredentials = btoa(`${wpAppCredentials.username}:${wpAppCredentials.password}`);
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + endpoint, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encryptedWpAppCredentials}`
      },
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch data from user database.')
  }
}

