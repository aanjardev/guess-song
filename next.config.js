/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/itunes/:path*",
        destination: "http://itunes.apple.com/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
