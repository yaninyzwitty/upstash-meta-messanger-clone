/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['links.papareact.com', 'https://images.unsplash.com', "instagram.fnbo13-1.fna.fbcdn.net", "platform-lookaside.fbsbx.com"],
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true

  }
 
}

module.exports = nextConfig
