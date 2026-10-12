/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "snnnurtjzdkjweoewrwf.supabase.co",
      },
      {
        protocol: "https",
        hostname: "www.hulumart.com",
      },
    ],
  },
  async redirects() {
    return ["laptap.in", "www.laptap.in", "hulumart.com"].map(host => ({
        source: "/:path*",
        has: [{ type: "host", value: host }],
        destination: "https://www.hulumart.com/:path*",
        permanent: true,
      }));
  },
};

export default nextConfig;
