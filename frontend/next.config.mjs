/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone build упрощает запуск внутри Docker-контейнера
  // (итоговый билд помещается в отдельную папку и не требует node_modules).
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
