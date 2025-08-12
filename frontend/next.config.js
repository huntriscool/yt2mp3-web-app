/** @type {import('next').NextConfig} */
const nextConfig = {
  // To proxy API requests to backend server during dev
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

export default nextConfig;
