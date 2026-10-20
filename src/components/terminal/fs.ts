import { config } from "@/data/config";

/**
 * 一个极简的虚拟文件系统。
 * 终端里的 `ls` / `cd` / `cat` 全部走这棵树 —— 不碰真实文件，纯前端。
 */

export type VNode = {
  name: string;
  kind: "file" | "dir";
  /** 文件正文，纯文本，行首 `#` 会被渲染成强调色 */
  content?: string;
  children?: VNode[];
  /** 外部链接，`open` 会用到 */
  href?: string;
  /** 一句话说明，`ls -l` 显示 */
  hint?: string;
};

const about = `# 关于我

我是 ${config.author}，${config.role}。

这条路是从「想搞明白一个请求在网络上到底发生了什么」开始的。
先把博客搭起来，再把学到的东西一条条写下来，写着写着发现
光看是没用的 —— 得自己动手做一个东西出来。

所以有了酒店管理系统（第一个从零写到线上的项目），
有了电商小程序（27 个页面，完整链路），
现在在做知识库和 Agent 工作流平台。

同时也在按路线补网络安全：网络基础 → Linux → OWASP Top 10 → 工具链 → 靶场。

# 相信的事

1. 写不出来 = 没懂。
2. 先跑通，再抽象。
3. 踩过的坑不记下来，下次还会踩。
`;

const resume = `# 简历 · 摘要

完整版在 /resume 页面，这里给个快照。

## 技能
Java / Spring Boot / PostgreSQL / Docker / Nginx
TypeScript / React / Next.js / Tailwind / Taro
Linux / Git / Bash

## 方向
网络安全（进行中）· 全栈开发 · AI Agent 应用

## 项目
- 知识库与 Agent 工作流平台   2026.09 – 至今
- 电商小程序（27 页）          2026.09 – 2026.10
- 酒店管理系统（Spring Boot）  2026.03 – 2026.06
- 本站（Next.js + WebGL）      2026.10

## 联系方式
${config.email}
${config.site}
`;

const contact = `# 联系方式

邮箱    ${config.email}
GitHub  ${config.social.github}
站点    ${config.site}
位置    ${config.location}

# 说明

邮件是我看得最勤的渠道。项目合作、技术问题、或者只是想聊两句，都可以。
如果是为了某个具体的事找我，标题里写清楚会快很多。
`;

const projKnowledge = `# 知识库与 Agent 工作流平台

Next.js + TypeScript + PostgreSQL(pgvector) + Docker + Python。

# 想解决什么

大模型能聊，但它不知道我手里那几百份文档讲了什么，
而且每次问都要从头讲一遍。
我要的是一个能消化私有资料、还能按流程替我把活干完的系统。

目标不是「又一个聊天框」，而是：喂进去一堆资料，它自己长出知识结构。

# 已经跑通

1. 文档解析入库 —— PDF / Markdown / 纯文本统一成结构化片段，
   再向量化存进 PostgreSQL。切分尽量按语义边界，不按字数。
2. 混合检索 —— 向量召回 + 关键词召回 + 融合排序 + 相关性重排。
   每一段都能点开看原文出处，答不出来源的答案直接不算数。
3. Agent 编排 —— 「检索 → 判断 → 调用工具 → 汇总」做成可配置节点流，
   用 React Flow 拖出来，改完立刻能跑，全程有日志。

# 正在啃

- 长文档切分的语义边界（切太碎丢上下文，切太长检索不准）
- 多轮检索的上下文预算（多次召回全塞进去既贵又互相干扰）
- 工具调用的失败重试（模型会编造参数、会调不存在的工具）

# 为什么还在做

因为它逼着我把三块本来分开的知识缝到一起：
检索算法、工程架构、模型本身的行为边界。
任何一个环节偷懒，整条链子都会在最后一环露馅。
`;

const projHuana = `# 电商小程序

Taro 4 + React + TypeScript，27 个页面，跑在微信里。

# 为什么做这个

想验证一件事：状态一致性到底有多难。
购物车里的一件商品，它的价格、库存、可用券、是否参与秒杀，
在五个页面里必须永远是同一个答案。页面一多，这件事就开始崩。

# 怎么解决的

把状态层单独抽出来（src/store），页面只负责呈现。
所有跨页共享的数据走同一套模型（src/models），28 个页面共用一套类型定义。
改一个字段，TypeScript 会把所有需要跟着改的地方指出来。

秒杀、拼团、砍价三种玩法，最后都收敛到同一个订单状态机 ——
玩法是订单的前置状态，不是订单的分支。

# 工程约束

ESLint 零警告 + tsc + 一个自定义的分层守卫脚本（check-layering.mjs）。
它会阻止 UI 层直接引用数据层，保证依赖方向永远单向。
在页面数接近 30 的项目里，这种约束比写多少功能都重要。

# 链接
（源码暂未公开）
`;

const projHotel = `# 酒店管理系统

Spring Boot 4 + Java 21 + PostgreSQL + Thymeleaf + Docker。

# 背景

大二大创赛的选题。那时候刚接触 Java Web，
Spring Boot 是现学的，PostgreSQL 是现学的，Docker 也是现学的。
从建库、写实体、做页面到部署上线，第一次把一整套流程完整走下来。

# 功能

客房管理（房型、房间状态实时显示）
住客管理（信息登记、与订单关联）
订单管理（入住、退房、状态流转）
后台管理（管理员权限、数据初始化）

分层是 Controller / Service / Repository 三层，JPA + Hibernate 做持久化。

# 两个真踩过的坑

1. Railway 的数据库变量不自动共享。
   挂了 PostgreSQL 之后应用一直连不上，查日志才发现 PGHOST / PGPASSWORD
   这些只在 Postgres 服务里存在，应用服务读不到。
   最后用 "railway variable set --service" 手动搬过去。
   卡了大半天 —— 结论是配置问题永远先怀疑环境，别怀疑代码。

2. Docker 构建遇到中文路径。
   Windows 下项目在 E:\\项目\\酒店管理\\，Docker 构建和 Maven 打包都会挂。
   解法是用 mklink /J 建一个纯 ASCII 的目录链接绕过去。

# 链接
https://github.com/Daylight-by/hotel-management
`;

const projSite = `# 本站 · 作品集

Next.js 16 静态导出，托管在 GitHub Pages，绑了自定义域名。

# 三样东西

开屏   实时流体模拟（GPU 上的 Navier-Stokes 求解器，GLSL 手写）
主界面 3D 键盘（每颗键帽是一个技术栈，能按下去）
终端   就是你正在用的这个

# 为什么做终端

作品集通常是「我排版好，你从上往下滚」。我想试试反过来 —— 你问，我答。
访客想知道什么就敲什么，不想知道的可以跳过。

# 技术上

output: "export" 静态导出。没有 API 路由、没有服务端运行时、图片优化也关了。
所有动态能力（GitHub 星标、终端、流体）都在构建期预取或纯客户端运行。

流体部分基于 Pavel Dobryakov 的 MIT 开源实现，
移植成 TypeScript 模块，去掉 bloom 和后处理，只留最核心的场求解。
`;

const blogHello = `# 博客搭建完成

2026-06-19 · 随笔

今天终于把自己的个人博客搭好了，用的是 Hexo + GitHub Pages + Butterfly 主题，
绑定了自己的域名 bsqdsq.top。

# 为什么搭博客

作为一个网安零基础的新手，我打算通过写博客的方式来记录自己的学习过程。
把学到的东西写下来，和只是看懂是完全不同的两件事。

# 学习计划

- 网络基础 — TCP/IP、HTTP/HTTPS、DNS 等协议
- Linux 基础 — 命令行操作、权限管理
- Web 安全入门 — OWASP Top 10 漏洞原理与实操
- 工具学习 — Burp Suite、Nmap、sqlmap 等
- 实战练习 — CTF 刷题、靶场练习

这条路线不一定完美，先走起来再说，边走边调整。
`;

const blogHotel = `# 酒店管理系统 · Spring Boot 全栈项目

2026-06-23 · 项目实战

大二参加大创赛时做的项目。从零开始学 Spring Boot，
一路写代码、搭数据库、做前端页面，最后部署上线。

# 技术栈

Spring Boot 4 / Java 21 / Thymeleaf / JPA + Hibernate
PostgreSQL / Docker / Railway

# 部署

Docker 多阶段构建，通过 Railway 部署到云端。
环境变量通过 Railway 自动注入，application.properties 里用
"\${PGHOST:localhost}" 这种方式做兜底，本地开发和线上共用一套配置。

# 踩坑

Railway 数据库变量不共享、Docker 构建中文路径问题。
详细过程写在 projects/hotel-management.md 里了。

# 总结

虽然代码不算复杂，但对我来说意义挺大。
大二刚接触 Java Web，很多东西都是边学边做，踩了不少坑。
现在重新把部署流程跑了一遍，算是给这个项目画了个完整的句号。
`;

export const ROOT: VNode = {
  name: "~",
  kind: "dir",
  children: [
    { name: "about.md", kind: "file", content: about, hint: "我是谁" },
    { name: "resume.md", kind: "file", content: resume, hint: "简历摘要" },
    { name: "contact.md", kind: "file", content: contact, hint: "怎么找到我" },
    {
      name: "projects",
      kind: "dir",
      hint: "4 个项目",
      children: [
        {
          name: "knowledge-hub.md",
          kind: "file",
          content: projKnowledge,
          hint: "知识库与 Agent 工作流 · 主力项目",
        },
        {
          name: "huana-mall.md",
          kind: "file",
          content: projHuana,
          hint: "电商小程序 · Taro",
        },
        {
          name: "hotel-management.md",
          kind: "file",
          content: projHotel,
          hint: "酒店管理系统 · Spring Boot",
        },
        {
          name: "portfolio-site.md",
          kind: "file",
          content: projSite,
          hint: "本站 · Next.js + WebGL",
        },
      ],
    },
    {
      name: "blog",
      kind: "dir",
      hint: "2 篇文章",
      children: [
        {
          name: "hello-world.md",
          kind: "file",
          content: blogHello,
          hint: "2026-06-19",
          href: "/blogs/hello-world",
        },
        {
          name: "hotel-management-springboot.md",
          kind: "file",
          content: blogHotel,
          hint: "2026-06-23",
          href: "/blogs/hotel-management-springboot",
        },
      ],
    },
    {
      name: "secrets",
      kind: "dir",
      hint: "别进来",
      children: [
        {
          name: "TODO.md",
          kind: "file",
          hint: "还没做完的事",
          content: `# TODO

- [x] 把博客从 Hexo 迁过来
- [x] 开屏换成流体
- [x] 加一个终端
- [ ] 把 OWASP Top 10 每一篇都写一遍
- [ ] 知识库的检索质量再调一版
- [ ] 学 Go
- [ ] 早睡

最后一条大概永远完不成。
`,
        },
      ],
    },
  ],
};

/** 把路径解析成节点。返回 null 表示不存在。 */
export function resolve(path: string[], root: VNode = ROOT): VNode | null {
  let node: VNode = root;
  for (const part of path) {
    if (node.kind !== "dir" || !node.children) return null;
    const next = node.children.find((c) => c.name === part);
    if (!next) return null;
    node = next;
  }
  return node;
}

/** 列出某个目录下的直接子节点 */
export function listDir(path: string[]): VNode[] {
  const node = resolve(path);
  if (!node || node.kind !== "dir" || !node.children) return [];
  return node.children;
}

/** 所有可补全的名字（用于 Tab） */
export function allNames(root: VNode = ROOT): string[] {
  const out: string[] = [];
  const walk = (n: VNode) => {
    for (const c of n.children ?? []) {
      out.push(c.name);
      if (c.kind === "dir") walk(c);
    }
  };
  walk(root);
  return out;
}
