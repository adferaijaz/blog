const nextConfig = {
  output: "export",
  basePath: "/blog",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "date-fns"],
  },
};

export default nextConfig;