import { wp_fetch } from '@/lib/wp-fetch';
import { emailToken } from '../lib/verify';

interface UserLog {
  username: string;
  email: string;
  password: string;
}

export async function register(credentials: UserLog) {
  try {
    if (!credentials.username || !credentials.email || !credentials.password) {
      return { error: 'Missing required parameters.' };
    }
    const user = await wp_fetch('users', 'POST', credentials);
    if (user.id) {
      // Creates a JWT token and sends a verification email
      const token = await emailToken(credentials.username, credentials.password, user.id, credentials.email);
      // Converts the 1st parameter to an Integer using the decimal (base-10 as 2nd parameter) system
      return token;
    } 
    else {
      console.error(`Error creating user: ${user.message}`);
      return { error: user.message };
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'Internal Server Error' };
  }
}
