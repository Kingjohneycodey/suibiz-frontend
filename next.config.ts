import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com", "randomuser.me", "picsum.photos"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Completely skips ESLint during builds
  },
};

export default nextConfig;
