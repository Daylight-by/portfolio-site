import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight, ExternalLink, Link2, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
const BASE_PATH = "/assets/projects-screenshots";

// Renders a brand SVG from /public as a monochrome glyph that inherits the
// surrounding text color (the skill dock styles every icon via currentColor),
// so full-color marks like Mistral flatten to match the rest of the set.
const MaskIcon = ({ src, title }: { src: string; title?: string }) => (
  <span
    role="img"
    aria-label={title}
    className="block bg-current"
    style={{
      width: "1em",
      height: "1em",
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskSize: "contain",
      maskSize: "contain",
    }}
  />
);

const ProjectsLinks = ({ live, repo }: { live?: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      {live && live !== "#" && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={live}
        >
          <Button variant={"default"} size={"sm"}>
            Visit Website
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
      {repo && repo !== "#" && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};
// Brand chips sourced from thesvg CLI mono SVGs in /public/assets/logos,
// rendered via MaskIcon so each one inherits the dock's currentColor.
const brand = (title: string, file: string): Skill => ({
  title,
  bg: "black",
  fg: "white",
  icon: <MaskIcon src={`/assets/logos/${file}`} title={title} />,
});
const PROJECT_SKILLS = {
  next: brand("Next.js", "nextdotjs-mono.svg"),
  chakra: brand("Chakra UI", "chakra-ui-mono.svg"),
  node: brand("Node.js", "nodedotjs-mono.svg"),
  python: brand("Python", "python-mono.svg"),
  prisma: brand("Prisma", "prisma-mono.svg"),
  postgres: brand("PostgreSQL", "postgresql-mono.svg"),
  mongo: brand("MongoDB", "mongodb-mono.svg"),
  express: brand("Express", "express-mono.svg"),
  reactQuery: brand("React Query", "react-query-mono.svg"),
  shadcn: brand("shadcn/ui", "shadcn-ui-mono.svg"),
  // Not in the thesvg registry — keep the existing custom logo.
  aceternity: {
    title: "Aceternity",
    bg: "black",
    fg: "white",
    icon: <AceTernityLogo />,
  },
  tailwind: brand("Tailwind", "tailwind-css-mono.svg"),
  docker: brand("Docker", "docker-mono.svg"),
  // Not in the thesvg registry — keep the text mark.
  yjs: {
    title: "Y.js",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>Y</strong>js
      </span>
    ),
  },
  firebase: brand("Firebase", "firebase-mono.svg"),
  sockerio: brand("Socket.io", "socketdotio-mono.svg"),
  js: brand("JavaScript", "javascript-mono.svg"),
  ts: brand("TypeScript", "typescript-mono.svg"),
  vue: brand("Vue.js", "vuedotjs-mono.svg"),
  react: brand("React.js", "react-mono.svg"),
  sanity: brand("Sanity", "sanity-mono.svg"),
  gsap: brand("GSAP", "gsap-mono.svg"),
  motion: brand("Motion", "motion.svg"),
  supabase: brand("Supabase", "supabase-mono.svg"),
  trpc: brand("tRPC", "trpc-mono.svg"),
  drizzle: brand("Drizzle ORM", "drizzle-mono.svg"),
  hono: brand("Hono", "hono-mono.svg"),
  redis: brand("Redis / BullMQ", "redis-mono.svg"),
  cloudflare: brand("Cloudflare", "cloudflare-mono.svg"),
  // React Native reuses the React mark.
  reactNative: brand("React Native", "react-mono.svg"),
  betterAuth: brand("Better Auth", "better-auth-mono.svg"),
  // Not in the thesvg registry — keep the text marks.
  zustand: {
    title: "Zustand",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Zu</span>,
  },
  partykit: {
    title: "PartyKit",
    bg: "black",
    fg: "white",
    icon: <span className="text-base">🎈</span>,
  },
  hocuspocus: {
    title: "Hocuspocus",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Hp</span>,
  },
  // React Flow ships under the xyflow brand.
  reactFlow: brand("React Flow", "xyflow-mono.svg"),
  codemirror: brand("CodeMirror", "codemirror-mono.svg"),
  // "Satori / sharp" — uses the sharp mark.
  satori: brand("Satori / sharp", "sharp-mono.svg"),
  turborepo: brand("Turborepo", "turborepo-mono.svg"),
  // Vercel AI SDK uses the Vercel mark.
  aiSDK: brand("Vercel AI SDK", "vercel-mono.svg"),
  anthropic: brand("Anthropic Claude", "anthropic-mono.svg"),
  mistral: brand("Mistral AI", "mistral-ai-mono.svg"),
  // Not in the thesvg registry — keep the text mark.
  nextIntl: {
    title: "next-intl",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">i18n</span>,
  },
  // Not in the thesvg registry — keep the text marks.
  expo: {
    title: "Expo",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Expo</span>,
  },
  mcp: {
    title: "MCP",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">MCP</span>,
  },
  // ---- 个人技术栈补充 ----
  java: {
    title: "Java",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">JV</span>,
  },
  spring: brand("Spring", "spring-mono.svg"),
  springboot: brand("Spring Boot", "springboot-mono.svg"),
  thymeleaf: {
    title: "Thymeleaf",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Th</span>,
  },
  linux: brand("Linux", "linux-mono.svg"),
  bash: brand("Bash", "bash-mono.svg"),
  mysql: brand("MySQL", "mysql-mono.svg"),
  nginx: brand("Nginx", "nginx-mono.svg"),
  git: brand("Git", "git-mono.svg"),
  kali: brand("Kali Linux", "kalilinux-mono.svg"),
  burp: brand("Burp Suite", "burpsuite-mono.svg"),
  huggingface: brand("Hugging Face", "huggingface-mono.svg"),
  openai: brand("OpenAI", "openai-mono.svg"),
  taro: {
    title: "Taro",
    bg: "black",
    fg: "white",
    icon: <span className="text-xs font-bold">Ta</span>,
  },
  weapp: {
    title: "微信小程序",
    bg: "black",
    fg: "white",
    icon: <span className="text-[10px] font-bold">小程序</span>,
  },
};
export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};

const projects: Project[] = [
  {
    id: "knowledge-hub",
    category: "自建 RAG · Agent 编排",
    title: "知识库与 Agent 工作流平台",
    src: "/assets/projects-screenshots/knowledge-hub/cover.jpg",
    screenshots: ["cover.jpg"],
    skills: {
      frontend: [
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.reactFlow,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.postgres,
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.docker,
        PROJECT_SKILLS.aiSDK,
        PROJECT_SKILLS.openai,
      ],
    },
    live: "",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            喂进去一堆资料，让它自己长出知识结构 —— 而不是又一个聊天框。
          </TypographyP>
          <TypographyP className="font-mono">
            这是目前投入最多的一个项目。出发点很直接：大模型能聊，
            但它不知道我手里那几百份文档讲了什么，而且每次问都要从头讲一遍。
            我要的是一个能消化私有资料、还能按流程替我把活干完的系统。
          </TypographyP>

          <TypographyH3 className="my-4 mt-8">已经跑通的部分</TypographyH3>
          <p className="font-mono mb-2">
            <strong>文档解析与入库。</strong>
            PDF / Markdown / 纯文本先统一成结构化片段，再做向量化存进
            PostgreSQL（pgvector）。切分不是按字数切，而是尽量按语义边界切 ——
            这一步的质量直接决定后面检索的上限。
          </p>
          <p className="font-mono mb-2">
            <strong>混合检索。</strong>
            纯向量检索在专有名词上会翻车，所以叠了一层关键词召回再做融合排序，
            最后还要过一遍相关性重排。召回的每一段都能点开看原文出处，
            答不出来源的答案直接不算数。
          </p>
          <p className="font-mono mb-2">
            <strong>Agent 编排。</strong>
            把「检索 → 判断 → 调用工具 → 汇总」做成可配置的节点流，
            用 React Flow 在前端直接把工作流拖出来，改完立刻能跑。
            工具调用全程有日志，错了能看到是哪一步错的、错在哪。
          </p>

          <TypographyH3 className="my-4 mt-8">正在啃的硬骨头</TypographyH3>
          <p className="font-mono mb-2">
            长文档切分的语义边界：切太碎丢上下文，切太长检索不准，
            目前靠标题层级加滑动窗口折中，还在调。
          </p>
          <p className="font-mono mb-2">
            多轮检索的上下文预算：一轮问答可能触发多次检索，
            全部塞进上下文既贵又容易互相干扰，需要一套丢弃策略。
          </p>
          <p className="font-mono mb-2">
            工具调用的失败重试：模型会编造参数、会调不存在的工具，
            现在靠 schema 校验加有限次重试兜底，距离「稳」还有距离。
          </p>

          <TypographyH3 className="my-4 mt-8">为什么还在做</TypographyH3>
          <p className="font-mono mb-2">
            因为它逼着我把三块本来分开的知识缝到一起：
            检索算法、工程架构、以及模型本身的行为边界。
            任何一个环节偷懒，整条链子都会在最后一环露馅。
          </p>
        </div>
      );
    },
  },
  {
    id: "huana-mall",
    category: "微信小程序 · 电商全链路",
    title: "电商小程序",
    src: "/assets/projects-screenshots/huana-mall/cover.jpg",
    screenshots: ["cover.jpg"],
    skills: {
      frontend: [
        PROJECT_SKILLS.taro,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.weapp,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.git,
      ],
    },
    live: "",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            27 个页面，一条完整的电商链路 —— 从逛到买，从退到售后。
          </TypographyP>
          <TypographyP className="font-mono">
            用 Taro 4 + React + TypeScript 构建的微信小程序。这不是一个「商品列表 +
            详情页」的演示项目，而是把真实电商该有的东西全铺了一遍：分类导航、
            搜索、购物车、下单、支付确认、物流跟踪、售后申请、评价晒单、
            优惠券、收藏、浏览历史、地址簿、会员等级、积分商城……
          </TypographyP>

          <TypographyH3 className="my-4 mt-8">为什么值得说</TypographyH3>
          <p className="font-mono mb-2">
            电商最难的地方从来不是页面数量，而是<strong>状态的一致性</strong>。
            购物车里的一件商品，它的价格、库存、可用优惠券、是否参与秒杀，
            在五个页面里必须始终是同一个答案。
          </p>
          <p className="font-mono mb-2">
            这个项目里我把状态层单独抽出来（<code>src/store</code>），
            页面只负责呈现，所有跨页共享的数据都走同一套模型
            （<code>src/models</code>）。28 个页面共用一套类型定义，
            改一个字段，TypeScript 会把所有需要跟着改的地方指出来。
          </p>

          <TypographyH3 className="my-4 mt-8">营销玩法</TypographyH3>
          <p className="font-mono mb-2">
            秒杀、拼团、砍价——三种玩法的时间窗口、成团条件、价格计算规则
            各不相同，但最后都要落到同一个订单模型上。
            这块的设计取舍是：<em>玩法是订单的前置状态机，不是订单的分支</em>。
          </p>

          <TypographyH3 className="my-4 mt-8">工程约束</TypographyH3>
          <p className="font-mono mb-2">
            项目跑了一套强制校验：ESLint 零警告 + tsc 类型检查 + 自定义的
            <strong>分层守卫脚本</strong>（<code>check-layering.mjs</code>）——
            它会阻止 UI 层直接引用数据层，保证依赖方向永远单向。
            在一个页面数接近 30 的项目里，这种约束比写多少功能都重要。
          </p>
        </div>
      );
    },
  },
  {
    id: "hotel-management",
    category: "Spring Boot · 全栈实战",
    title: "酒店管理系统",
    src: "/assets/projects-screenshots/hotel-management/cover.jpg",
    screenshots: ["cover.jpg"],
    skills: {
      frontend: [
        PROJECT_SKILLS.springboot,
        PROJECT_SKILLS.thymeleaf,
        PROJECT_SKILLS.java,
      ],
      backend: [
        PROJECT_SKILLS.postgres,
        PROJECT_SKILLS.docker,
        PROJECT_SKILLS.nginx,
        PROJECT_SKILLS.git,
      ],
    },
    github: "https://github.com/Daylight-by/hotel-management",
    live: "",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            第一个从零写到线上的项目。大二，大创赛，边学边做。
          </TypographyP>
          <TypographyP className="font-mono">
            大二参加大创赛时的选题。那时候刚接触 Java Web，
            Spring Boot 是现学的，PostgreSQL 是现学的，Docker 也是现学的。
            从建库、写实体、做页面到部署上线，第一次把一整套流程完整走下来。
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">做了什么</TypographyH3>
          <p className="font-mono mb-2">
            客房管理（房型、房间状态实时显示）、住客管理（信息登记、
            与订单关联）、订单管理（入住、退房、状态流转）、
            后台管理（管理员权限、数据初始化）。
          </p>
          <p className="font-mono mb-2">
            分层是标准的 Controller / Service / Repository 三层，
            JPA + Hibernate 做持久化。前端用 Thymeleaf 服务端渲染 ——
            当时的选择理由很朴素：不想再学一个前端框架。
          </p>

          <TypographyH3 className="my-4 mt-8">两个真踩过的坑</TypographyH3>
          <p className="font-mono mb-2">
            <strong>Railway 的数据库变量不自动共享。</strong>
            挂了 PostgreSQL 之后应用一直连不上，查日志才发现
            <code>PGHOST</code> / <code>PGPASSWORD</code> 这些只在 Postgres
            服务里存在，应用服务读不到。最后用
            <code>railway variable set --service</code> 手动搬过去。
            卡了大半天，结论是「配置问题永远先怀疑环境，别怀疑代码」。
          </p>
          <p className="font-mono mb-2">
            <strong>Docker 构建遇到中文路径。</strong>
            Windows 下项目放在 <code>E:\项目\酒店管理\</code>，
            Docker 构建和 Maven 打包都会挂。解法是用
            <code>mklink /J</code> 建一个纯 ASCII 的目录链接绕过去。
          </p>

          <TypographyH3 className="my-4 mt-8">现在的状态</TypographyH3>
          <p className="font-mono mb-2">
            代码完整开源在 GitHub 上，Dockerfile 和多阶段构建都在仓库里。
            线上 demo 因为 Railway 免费实例到期已经下线了 ——
            想看跑起来的样子，clone 下来 <code>docker compose up</code> 即可。
          </p>
        </div>
      );
    },
  },
  {
    id: "portfolio-site",
    category: "个人站点 · WebGL",
    title: "本站 · 作品集",
    src: "/assets/projects-screenshots/portfolio-site/cover.jpg",
    screenshots: ["cover.jpg"],
    skills: {
      frontend: [
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.gsap,
        PROJECT_SKILLS.motion,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [PROJECT_SKILLS.node, PROJECT_SKILLS.git],
    },
    github: "https://github.com/Daylight-by/Daylight-by.github.io",
    live: "https://bsqdsq.top",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            你正在看的这个东西。流体、键盘、终端，三样东西拼在一起。
          </TypographyP>
          <TypographyP className="font-mono">
            一个纯静态导出的 Next.js 站点，托管在 GitHub Pages 上，
            绑了自己的域名。没有服务端，没有数据库，所有交互都跑在浏览器里。
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">开屏：实时流体</TypographyH3>
          <p className="font-mono mb-2">
            首屏不是一张图，是一个跑在 GPU 上的 Navier-Stokes 流体求解器 ——
            GLSL 写的平流、涡度、压力迭代、梯度消去，一帧十几个 shader pass。
            鼠标划过会真的搅动染料，空闲时自己喷。
            <strong>而且不滚动就不让你进</strong>，算是个小小的入场仪式。
          </p>
          <p className="font-mono mb-2">
            这段流体模拟基于 Pavel Dobryakov 的开源实现（MIT），
            我把它移植成了 TypeScript 模块，去掉了 bloom 和后处理，
            只留下最核心的场求解，这样在移动端也能跑满帧。
          </p>

          <TypographyH3 className="my-4 mt-8">主界面：3D 键盘</TypographyH3>
          <p className="font-mono mb-2">
            每个技术栈是一颗可以按下去的键帽，用 Three.js 渲染。
            按下去有真实的下压行程和回弹，键帽上的 logo 跟着倾斜。
            这不是装饰 —— 点开一颗键，会告诉你我用它做过什么。
          </p>

          <TypographyH3 className="my-4 mt-8">终端：真正的入口</TypographyH3>
          <p className="font-mono mb-2">
            全站藏了一个终端。按 <code>Ctrl</code> + <code>K</code>
            或者点右下角的图标就能唤起来，敲 <code>help</code> 看命令。
            <code>whoami</code> 看我是谁，<code>ls</code> 逛目录，
            <code>show</code> 读文章，<code>theme</code> 换配色。
          </p>
          <p className="font-mono mb-2">
            做这个的动机很直接：作品集通常是「我排版好，你从上往下滚」。
            我想试试反过来 —— <em>你问，我答</em>。
            访客想知道什么就敲什么，不想知道的可以跳过。
          </p>

          <TypographyH3 className="my-4 mt-8">技术上值得一提的</TypographyH3>
          <p className="font-mono mb-2">
            整套东西是 <code>output: &quot;export&quot;</code> 静态导出的。
            这意味着没有 API 路由、没有服务端渲染的运行时、
            连图片优化都得关掉。所有动态能力（GitHub 星标数、终端、流体）
            都在构建期预取或纯客户端运行。
          </p>
        </div>
      );
    },
  },
];
export default projects;
