/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["s3.us-east-1.amazonaws.com"]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
