import type { MetadataRoute } from "next";
import { config } from "@/data/config";

// 静态导出（output: "export"）下，路由处理器必须是静态的，否则构建期报错。
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // internal component playground — not part of the site
      disallow: ["/api/", "/components", "/components1", "/components2", "/components3", "/components-mono"],
    },
    sitemap: `${config.site}/sitemap.xml`,
    host: config.site,
  };
}
