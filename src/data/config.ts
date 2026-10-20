// ============================================================
// 站点配置 · Site Config
// 全站唯一的数据源：SEO、社交链接、开屏文案、邮件联系方式
// 改这里就能改全站，不用碰组件
// ============================================================

const config = {
  // 显示名（开屏、页脚、简历都会用）
  name: "Daylight",
  handle: "Daylight-by",

  title: "Daylight · 网络安全 & 全栈开发",
  description: {
    long: "Daylight 的个人作品集 —— 网络安全学习者、Java 全栈开发者。记录 Web 安全攻防、Spring Boot 工程实践与 AI Agent 应用的探索过程。含完整项目作品集、简历与技术博客。",
    short:
      "Daylight 的作品集 —— 网络安全 × 全栈开发 × AI Agent。含项目作品集、简历与技术博客。",
  },
  keywords: [
    "Daylight",
    "作品集",
    "portfolio",
    "网络安全",
    "Web 安全",
    "CTF",
    "Java",
    "Spring Boot",
    "全栈开发",
    "AI Agent",
    "知识库",
    "渗透测试",
    "Linux",
    "Next.js",
    "React",
  ],
  author: "Daylight",
  email: "18276524867@163.com",
  site: "https://bsqdsq.top",

  // 一句话自我介绍 —— 终端 `whoami` 与 hero 区都会用
  tagline: "网络安全学习者 · Java 全栈开发 · 正在把 AI Agent 落地",
  role: "网络安全 / 全栈开发",
  location: "中国 · 浙江",

  // for github stars button
  githubUsername: "Daylight-by",
  githubRepo: "hotel-management",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    github: "https://github.com/Daylight-by",
    email: "mailto:18276524867@163.com",
    twitter: "",
    linkedin: "",
    instagram: "",
    facebook: "",
  },
};

export { config };
