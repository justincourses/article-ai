/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // remotePatterns 用于配置允许通过 Next.js Image 组件加载的外部图片域名
    // 示例: 添加允许的域名
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'example.com',
    //     port: '',
    //   },
    // ],
  },
};

module.exports = nextConfig;
