import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // If deploying to GitHub Pages or subdirectory, uncomment and set basePath:
  // basePath: '/piano-flashcards',

  // For static export (if needed for GitHub Pages):
  // output: 'export',

  // Disable type checking during build (since we run tsc separately)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
