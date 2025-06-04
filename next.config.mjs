/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.3:5000/api/:path*', // Replace with your backend IP
      },
    ];
  },
};

export default nextConfig;
