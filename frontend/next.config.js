<<<<<<< HEAD
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   webpack: (config) => {
//     config.externals = [...(config.externals || []), { 'utf-8-validate': 'commonjs utf-8-validate', 'bufferutil': 'commonjs bufferutil' }]
//     return config
//   },
//   output: 'standalone',
//   async rewrites() {
//     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
//     return [
//       {
//         source: '/api/:path*',
//         destination: `${backendUrl}/:path*`,
//       },
//     ]
//   },
// }

// module.exports = nextConfig 
=======
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.externals = [...(config.externals || []), { 'utf-8-validate': 'commonjs utf-8-validate', 'bufferutil': 'commonjs bufferutil' }]
    return config
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
>>>>>>> ae4a3d7bb448f4c9fa5732fb0fa4c32fa5c39790
