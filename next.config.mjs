/** @type {import('next').NextConfig} */

const nextConfig = {
  // Configures NextJS <Image /> component to accept images from the API
  images: {
    domains: ['fakestoreapi.com'],
  },
};

export default nextConfig;