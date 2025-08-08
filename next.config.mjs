/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["s3.us-east-1.amazonaws.com","www.bobvila.com","www.cdn.mos.cms.futurecdn.net"]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
