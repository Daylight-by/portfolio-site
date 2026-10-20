/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages 是纯静态托管：导出为静态 HTML
  output: "export",
  // 导出为 /about/index.html 形式，GitHub Pages 才能可靠地做无扩展名路由
  trailingSlash: true,
  // 静态导出没有服务端图片优化器
  images: { unoptimized: true },
  // 说明：原项目的 headers() 配置在静态导出下不被支持（GitHub Pages 也无法自定义响应头），已移除。
  // 原项目的 cacheComponents 同样与 output: "export" 不兼容，已移除。
};

export default nextConfig;
