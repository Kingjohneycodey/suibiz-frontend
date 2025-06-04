import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos", "images.unsplash.com", "res.cloudinary.com", "randomuser.me"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Completely skips ESLint during builds
  },
};

export default nextConfig;
