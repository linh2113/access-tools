import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'product.hstatic.net',
            port: '',
            pathname: '/**'
         }
      ]
   }
}

export default nextConfig
