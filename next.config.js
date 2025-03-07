/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // remotePatterns 用于配置允许通过 Next.js Image 组件加载的外部图片域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
