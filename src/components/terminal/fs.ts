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

所以有了酒店管理系统（大二那版是第一个从零写到线上的项目），
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
- 来财酒店 PMS（Spring Boot + Vue3） 2026.03 – 至今
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

const projHotel = `# 来财酒店 PMS

Spring Boot 3.5 + Java 21 + MyBatis-Plus + MySQL + Redis + Vue 3 + Element Plus。

# 一句话

大二那版是 Thymeleaf 单体，这一版推倒重来：
33 张表、27 个后端模块、29 个前端页面，真能开门营业的那种。

# 为什么重做

上一版是「客房 + 住客 + 订单 + 后台」四个增删改查，能演示，
但离一家酒店真的能用差很远 —— 没有账务、没有夜审、没有房价日历，
连「今天该收多少钱」都算不出来。

这一版按真实 PMS 的业务边界重新拆：
房态、预订、账务（Folio）、夜审与营业日、收益定价、经营报表、
协议单位应收、合规与硬件对接。

# 几个花时间的地方

1. 房态不是一个字段，是一条链。
   退房 → 待清洁 → 自动生成清洁任务 → 保洁完成 → 领班核实 → 回空闲。
   跳一步就错，所以房间挂着未关闭的清洁任务时不允许直接改空闲。
2. 订单状态机与日期冲突。
   10→20→30→40，只有 10/20 能取消到 50。
   同房间 [入住日, 离店日) 不允许重复占用 —— 左闭右开，退房当天能再卖。
3. 金额只认后端。
   前端只做预估，实收一律后端按实时售价 × 晚数重算。
4. 多租户是白送的，但要守住。
   一张表漏了 tenant_id，两个门店的数据就串了。

# 不动上游一行代码

挂在芋道 yudao-boot-mini 脚手架上，业务代码全在自己的 yudao-module-hotel 里。
接入就是在根 pom 加一个 module、server 的 pom 引一个依赖。
好处是上游升级能直接 pull，代价是所有「顺手改框架」的念头都得忍住。

# 踩的坑

1. 建库不是一条 SQL。hotel.sql 只是 P0 的 14 张表，
   P1/P2 的增量在 t1~t5 里，必须按序累加。补了 sql/mysql/README.md 写死顺序。
2. pnpm 10+ 忽略 .npmrc 里的 onlyBuiltDependencies，
   必须写进 pnpm-workspace.yaml，否则 Vite 找不到 esbuild。
3. LocalDate 不加 @JsonFormat，前端拿到的日期整体差一天。

# 怎么跑

双击 一键启动.bat，后端 48080 / 前端 5173，
admin / admin123，进去就是房态看板。
公安上传、门锁、OTA 是适配层，用模拟数据演示。
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

const projYudao = `# 设计师家装服务平台

实习期间跟随团队参与开发的项目，基于芋道（yudao，2025.10）商城版二次开发，
连接业主与设计师的家装服务平台。平台级官方模块由团队维护，我跟着导师和同事做业务。

# 项目业务

- designer 设计师模块：档案、入驻审核、认证等级、服务项、排班节假日、
  预约下单、作品集 / 图片 / 空间、全景图、技能评分、评价、收藏、会话、通知、统计。
- designerCase 家装案例模块：案例主档、案例空间、家装案例。

两个模块是团队协作成果，我参与了业务接口、Service 逻辑和数据访问层的开发，
跟着 code review 对齐团队写法，走完了需求、编码、联调到上线全过程。

# 学到的东西

业务实体继承 TenantBaseDO，走多租户隔离和数据权限；
预约、排班、状态流转用枚举 + service 校验，防时间冲突和状态回跳。
官方模块一行没动，根 pom 加 module、server pom 引依赖即接入 ——
协作项目里守住边界比「顺手改一下」更重要。

两个业务模块约 300 个 Java 类、二十多张 MyBatis Mapper，
项目已在生产环境以 Spring Boot 48080 端口运行。

# 链接

源码为私有仓库，仅作展示。
`;

const projAsean = `# 东盟跨境中小商户智能风控预警平台

2026 年「数据要素 ×」大赛广西分赛（高校赛道）暨第六届广西公共数据开放创新应用大赛 · 二等奖。
面向中国—东盟跨境中小商户的可解释风控与事前预警原型，我负责整体设计与全栈实现。

# 评分模型

可解释评分卡 + 国别规则配置 + 事前预警特征。
权重：基础资质 20% / 经营合规 30% / 口岸通关 25% / 贸易活跃 15% / 综合调整 10%。
阈值和国别权重持久化在数据库，监管端可配。每条结论都能点开看来源。

# 三端

后端 Spring Boot 3.3 + Java 21 + MyBatis + MySQL 8 + Redis；
政务监管端 Vue 2 + Element UI + ECharts；
商户端原生微信小程序，17 个页面。

# 数据与边界

公开海关、口岸、贸易统计、政策目录数据，附数据可信说明与回测误报分析。
输出是风险辅助判断，不构成行政处罚、海关裁定或金融授信结论。

# 链接

github.com/Daylight-by/asean-risk-warning-platform（公开）
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

const blogHalfYear = `# 半年没更新

2026-10-22 · 随笔

时隔小半年，终于又上来发一篇了。
建博客那会儿的热情是真的，后来的懈怠也是真的。

# 那个没完成的计划

原本打算实习期间把网络安全学起来，路线都排好了。
结果现在回头看，完成度约等于零 —— 我高估了自己的勤奋。
上班一天回来，能打开电脑写两行代码就已经是胜利。

暑假找了个实习，公司不大，学到的东西确实不少。

# 大创赛要交了

赶紧把大二那个酒店管理系统翻出来。重新拉下来看的时候，说实话有点不好意思。
做得确实丑：表设计得随手、命名前后不统一、没有状态机、房态全靠 if 硬改。
如果这是别人写的代码，我大概会直接说「这个得重写」。

但它是我第一个从零写到线上的项目，还是不舍得丢掉。

# 于是重做了一版

基于芋道 yudao-boot-mini 做二次开发。有一说一，框架就是方便 ——
权限、租户、代码生成这些脏活它全包了，我只需要专注酒店业务。

33 张业务表 · 27 个后端模块 · 316 个 Java 文件 · 29 个前端页面模块。
补了账务账页、夜审营业日、收益定价、协议单位应收、房态与清洁任务的联动。

时间赶，不完善的地方也多：演示数据是凑的、边界情况没覆盖全、
公安 / 门锁 / OTA 只做了适配层。但至少，现在是能看的了。
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
      hint: "6 个项目",
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
          hint: "来财酒店 PMS · 33 张表",
        },
        {
          name: "yudao-designer.md",
          kind: "file",
          content: projYudao,
          hint: "设计师家装平台 · 芋道二次开发",
        },
        {
          name: "asean-risk.md",
          kind: "file",
          content: projAsean,
          hint: "东盟跨境风控 · 数据要素×大赛二等奖",
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
      hint: "3 篇文章",
      children: [
        {
          name: "half-year-later.md",
          kind: "file",
          content: blogHalfYear,
          hint: "2026-10-22",
          href: "/blogs/half-year-later",
        },
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
