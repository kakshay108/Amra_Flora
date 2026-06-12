import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder photography until real product shots are available.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
