/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['robohash.org', 'res.cloudinary.com'],
  },
  
}

module.exports = nextConfig
