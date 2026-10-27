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
    category: "酒店 PMS · 全栈工程",
    title: "来财酒店 PMS",
    src: "/assets/projects-screenshots/hotel-management/cover.jpg",
    screenshots: ["cover.jpg"],
    skills: {
      frontend: [
        PROJECT_SKILLS.vue,
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.springboot,
        PROJECT_SKILLS.java,
        PROJECT_SKILLS.mysql,
        PROJECT_SKILLS.redis,
        PROJECT_SKILLS.docker,
      ],
    },
    github: "https://github.com/Daylight-by/hotel-pms",
    live: "",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            大二那版是 Thymeleaf 单体。这一版推倒重来 —— 33 张表，前后端分离，真能开门营业的那种。
          </TypographyP>
          <TypographyP className="font-mono">
            还是大创赛的题，但规模完全不是一回事了。上一版是「客房 + 住客 + 订单 + 后台」
            四个增删改查，跑起来能演示，可离一家酒店真能用还差很远：没有账务、没有夜审、
            没有房价日历，连「今天该收多少钱」都算不出来。
          </TypographyP>
          <TypographyP className="font-mono">
            这一版按真实 PMS 的业务边界重新拆：房态、预订、账务（Folio）、夜审与营业日、
            收益定价、经营报表、协议单位应收、合规与硬件对接。前端也换成了 Vue3 + Element Plus
            的管理后台，另有一个 uni-app 的 C 端预订站。
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">规模</TypographyH3>
          <p className="font-mono mb-2">
            33 张业务表 · 316 个 Java 文件 · 27 个后端模块 · 29 个前端页面模块。
            所有业务表继承 <code>TenantBaseDO</code>，走芋道的多租户隔离。
          </p>

          <TypographyH3 className="my-4 mt-8">几个真正花时间的地方</TypographyH3>
          <p className="font-mono mb-2">
            <strong>房态不是一个字段，是一条链。</strong>
            退房 → 房间置「待清洁」→ 自动生成清洁任务 → 保洁完成 → 领班核实 → 房间回「空闲」。
            中间跳一步，房态就错了。所以房间挂着未关闭的清洁任务时，不允许直接改成空闲 ——
            这类约束我没写在注释里，写进了 service 的校验，并用接口级测试兜住。
          </p>
          <p className="font-mono mb-2">
            <strong>订单状态机与日期冲突。</strong>
            10 待确认 → 20 已确认 → 30 已入住 → 40 已退房，只有 10/20 能取消到 50。
            同一间房在 <code>[入住日, 离店日)</code> 区间内不允许重复占用 ——
            左闭右开意味着退房当天可以再卖，这个边界我调过一次才对。
          </p>
          <p className="font-mono mb-2">
            <strong>金额只认后端。</strong>
            前端只做预估展示，实收一律由后端按房间实时售价 × 晚数重算。
            前后端各算一套、结果对不上，是最容易被钻空子的地方。
          </p>
          <p className="font-mono mb-2">
            <strong>多租户是白送的，但要守住。</strong>
            请求带 <code>tenant-id</code> 头，框架负责隔离。听起来没我什么事，
            可只要有一张表漏了 <code>tenant_id</code>，两个门店的数据就串了。
          </p>

          <TypographyH3 className="my-4 mt-8">关于「不动上游一行代码」</TypographyH3>
          <p className="font-mono mb-2">
            整个项目挂在芋道（yudao-boot-mini）脚手架上，但业务代码全在自己的
            <code>yudao-module-hotel</code> 里，没改 <code>system</code> / <code>infra</code> 一行。
            接入方式就是在根 pom 加一个 module、server 的 pom 引一个依赖。
          </p>
          <p className="font-mono mb-2">
            好处是上游升级能直接 pull；代价是每次「顺手改一下框架」的念头都要忍住。
            最后发现，忍住的那些基本都不是真需求。
          </p>

          <TypographyH3 className="my-4 mt-8">踩的坑</TypographyH3>
          <p className="font-mono mb-2">
            <strong>建库不是一条 SQL。</strong>
            <code>hotel.sql</code> 只是 P0 的 14 张表，P1/P2 的增量散在 t1~t5 里，得按序累加。
            这个坑我自己也踩了，所以专门补了 <code>sql/mysql/README.md</code> 把顺序写死。
          </p>
          <p className="font-mono mb-2">
            <strong>pnpm 的 ERR_PNPM_IGNORED_BUILDS。</strong>
            pnpm 10+ 会忽略 <code>.npmrc</code> 里的 onlyBuiltDependencies，
            必须写进 <code>pnpm-workspace.yaml</code>，否则 Vite 起来找不到 esbuild。
          </p>
          <p className="font-mono mb-2">
            <strong>LocalDate 少了 @JsonFormat。</strong>
            不加注解，前端拿到的日期会整体差一天 —— 时区问题，排查起来比想象中费劲。
          </p>

          <TypographyH3 className="my-4 mt-8">现在的状态</TypographyH3>
          <p className="font-mono mb-2">
            后端 48080、前端 5173，双击 <code>一键启动.bat</code> 就能拉起来，
            <code>admin / admin123</code> 进去就是房态看板。
            公安上传、门锁、OTA 做的是标准适配层，用模拟数据演示 ——
            真接需要对接方资质，那不是代码能解决的事。
          </p>
        </div>
      );
    },
  },
  {
    id: "yudao-designer",
    category: "Spring Boot · 芋道二次开发",
    title: "设计师家装服务平台",
    src: "/assets/projects-screenshots/yudao-designer/cover.jpg",
    screenshots: ["cover.jpg"],
    skills: {
      frontend: [
        PROJECT_SKILLS.vue,
      ],
      backend: [
        PROJECT_SKILLS.springboot,
        PROJECT_SKILLS.java,
        PROJECT_SKILLS.mysql,
        PROJECT_SKILLS.redis,
      ],
    },
    live: "",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            实习期间跟着团队，第一次把 Spring Boot 的分层和规范用在真实业务上。
          </TypographyP>
          <TypographyP className="font-mono">
            这是我在实习期间参与开发的一个家装服务平台，连接业主与设计师，
            基于芋道（yudao，2025.10）商城版二次开发。平台级的官方模块
            （system / infra / 会员 / 交易）由团队维护，我跟随导师和同事，
            在其上做业务模块，走完了从需求、编码、联调到上线的全过程。
          </TypographyP>

          <TypographyH3 className="my-4 mt-8">项目做了什么</TypographyH3>
          <p className="font-mono mb-2">
            <strong>设计师模块（designer）。</strong>
            设计师档案、入驻审核、认证等级与变更记录、服务项、排班与节假日、预约下单与预约历史、
            作品集 / 图片 / 空间、全景图、技能评分、评价、收藏、会话沟通、消息通知、平台统计 ——
            二十多个业务子域，按芋道的 controller / service / dal / convert 分层组织。
          </p>
          <p className="font-mono mb-2">
            <strong>家装案例模块（designerCase）。</strong>
            案例主档、案例空间、家装案例，把作品和可复用的设计方案沉淀成可浏览的内容。
          </p>
          <p className="font-mono mb-2">
            这两个模块是团队协作的成果，我在其中参与了业务接口、Service 逻辑和数据访问层
            的开发，跟着 code review 一点点对齐团队的写法。
          </p>

          <TypographyH3 className="my-4 mt-8">在这个项目里学到的</TypographyH3>
          <p className="font-mono mb-2">
            业务实体一律继承 <code>TenantBaseDO</code>，走框架的多租户隔离和数据权限；
            预约、排班、状态流转用枚举加 service 校验兜住，避免时间冲突和状态回跳；
            全景图、作品集图片走资源服务统一管理。这些都是在真实项目里才真正理解的。
          </p>
          <p className="font-mono mb-2">
            团队坚持「不改上游」：根 pom 加 module、server pom 引依赖就能接入，
            官方框架升级可以直接 pull，不跟业务代码打架 —— 这也让我明白了协作项目里
            守住边界比「顺手改一下」更重要。
          </p>
          <p className="font-mono mb-2">
            两个业务模块共约 <strong>300 个 Java 类</strong>、二十多张 MyBatis Mapper，
            项目已在生产环境以 Spring Boot 48080 端口运行。
          </p>
        </div>
      );
    },
  },
  {
    id: "asean-risk",
    category: "数据要素×大赛 · 二等奖",
    title: "东盟跨境中小商户智能风控预警平台",
    src: "/assets/projects-screenshots/asean-risk/cover.jpg",
    screenshots: ["cover.jpg"],
    skills: {
      frontend: [
        PROJECT_SKILLS.vue,
        PROJECT_SKILLS.weapp,
      ],
      backend: [
        PROJECT_SKILLS.springboot,
        PROJECT_SKILLS.java,
        PROJECT_SKILLS.mysql,
        PROJECT_SKILLS.redis,
      ],
    },
    github: "https://github.com/Daylight-by/asean-risk-warning-platform",
    live: "",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-xl text-center">
            2026 年「数据要素 ×」大赛广西分赛（高校赛道）暨第六届广西公共数据开放创新应用大赛
            · 二等奖
          </TypographyP>
          <TypographyP className="font-mono">
            一套面向中国—东盟跨境中小商户的可解释风控与事前预警原型，把海关吞吐、口岸、
            贸易统计、政策目录等公开数据整合起来，输出企业合规风险的辅助判断。
            作品参加 2026 年「数据要素 ×」大赛广西分赛（高校赛道）暨第六届广西公共数据
            开放创新应用大赛，最终获<strong>二等奖</strong>，由我负责整体设计与全栈实现。
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">评分模型</TypographyH3>
          <p className="font-mono mb-2">
            核心是「可解释评分卡 + 国别规则配置 + 事前预警特征」。
            综合得分越高风险越低：基础资质 20%、经营合规 30%、口岸通关 25%、
            贸易活跃 15%、综合调整 10%，加权后再扣风险项。
            阈值和国别权重持久化在数据库，监管端可直接调。
          </p>
          <p className="font-mono mb-2">
            纯向量黑盒在合规场景里不可用，所以每一条召回的结论都能点开看来源，
            给不出依据的判断不算数。
          </p>

          <TypographyH3 className="my-4 mt-8">三端架构</TypographyH3>
          <p className="font-mono mb-2">
            <strong>后端</strong> Spring Boot 3.3 + Java 21 + MyBatis + MySQL 8 + Redis；
            <strong>政务监管端</strong> Vue 2 + Element UI + ECharts，做看板、预警和规则配置；
            <strong>商户端</strong> 原生微信小程序，17 个页面，含查询、评分、预警订阅、
            口岸、术语、合规、AI 助手等。
          </p>

          <TypographyH3 className="my-4 mt-8">数据与边界</TypographyH3>
          <p className="font-mono mb-2">
            数据集用的是公开的海关、口岸、贸易统计与政策目录，附了数据可信说明、回测与误报分析；
            系统输出是风险辅助判断，不构成行政处罚、海关裁定或金融授信结论，
            演示数据均为 DEMO 样例。
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
