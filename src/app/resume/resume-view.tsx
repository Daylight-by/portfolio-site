"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Download, ArrowLeft, Mail, Github, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumeDoodle from "./resume-doodle";
import { config } from "@/data/config";

const SECTIONS = {
  intro:
    "桂林信息科技学院信息工程学院软件工程本科大三在读，课程以 Java 为主，也学过一些 Python、C#、C。从 Java 全栈起步，独立做过从零到线上的完整项目；网络安全在自学，Agent 工作流平台仍在进行中。习惯把踩过的坑写成文档 —— 写不出来，说明还没懂。",
  skills: [
    { group: "语言", items: ["Java", "TypeScript", "JavaScript", "Python（基础）", "SQL"] },
    { group: "后端", items: ["Spring Boot 4", "JPA / Hibernate", "Node.js", "REST API"] },
    { group: "前端", items: ["React", "Next.js", "Taro", "Tailwind CSS", "Thymeleaf"] },
    { group: "数据", items: ["PostgreSQL", "MySQL", "Redis（了解）"] },
    { group: "运维", items: ["Docker", "Nginx", "Linux", "Git", "GitHub Actions"] },
    { group: "安全", items: ["Burp Suite", "Nmap", "sqlmap", "OWASP Top 10（学习中）"] },
  ],
  projects: [
    {
      name: "知识库与 Agent 工作流平台",
      period: "2026.09 – 至今",
      role: "独立开发",
      points: [
        "进行中的个人项目，不是已经完整上线的产品。目标是「喂进去资料，它自己长出知识结构」，而不是又一个聊天框。",
        "核心已跑通：文档解析、向量检索、Agent 编排、工作流可视化。",
        "正在攻长文档切分的语义边界、多轮检索的上下文预算、工具调用的失败重试。",
      ],
      stack: "Next.js · TypeScript · PostgreSQL · Docker",
    },
    {
      name: "东盟跨境中小商户智能风控预警平台",
      period: "2026",
      role: "Java 全栈竞赛原型",
      points: [
        "2026年「数据要素×」广西分赛高校赛道（第六届广西公共数据开放创新应用大赛）二等奖。",
        "可解释评分卡与国别规则配置。技术栈：Spring Boot 3.3.5、Java 21、MyBatis、MySQL、Redis、Vue 2、Element UI、ECharts、原生微信小程序，可用 Docker Compose 启动。",
      ],
      stack: "github.com/Daylight-by/asean-risk-warning-platform",
    },
    {
      name: "微信小程序 · 电商全链路",
      period: "2026.09 – 2026.10",
      role: "独立开发",
      points: [
        "27 个页面覆盖浏览、下单、支付确认、物流、售后、评价的完整链路。",
        "抽出独立状态层解决跨页数据一致性；三种营销玩法收敛到同一订单状态机。",
        "用 ESLint 零警告 + tsc + 自定义分层守卫脚本约束 28 个页面的依赖方向。",
      ],
      stack: "Taro 4 · React · TypeScript · Tailwind",
    },
    {
      name: "来财酒店 PMS",
      period: "2026.03 – 至今",
      role: "大创赛项目 · 全栈",
      points: [
        "从 Thymeleaf 单体重构为前后端分离的完整 PMS：33 张业务表、27 个后端模块、29 个前端页面。",
        "覆盖房态与清洁联动、订单状态机、账务 Folio、夜审营业日、收益定价、协议单位应收。",
        "基于芋道脚手架增量开发，业务全部收敛在自定义模块内，未改动上游 system / infra 代码。",
      ],
      stack: "Spring Boot 3.5 · MyBatis-Plus · MySQL · Redis · Vue 3 · uni-app",
    },
    {
      name: "个人作品集站点",
      period: "2026.10",
      role: "独立开发",
      points: [
        "Next.js 静态导出部署到 GitHub Pages，绑定自定义域名。",
        "首屏是手写 GLSL 的实时流体模拟，主界面是可交互 3D 键盘。",
        "内置终端交互层，支持命令浏览全站内容。",
      ],
      stack: "Next.js 16 · WebGL · GLSL · GSAP · TypeScript",
    },
  ],
  intent: ["实习", "全栈 / Java 后端；Agent 相关也可以"],
  internship: {
    company: "三明市华旭玮悦网络科技有限公司",
    title: "软件开发工程师",
    period: "2026.07 – 2026.11",
    points: [
      "独立完成并已上线「宅安居管理系统 3.0」：欧派、鸣格员工使用的内部客户与订单系统。前端 HTML + JavaScript，后端为腾讯云 CloudBase（数据库 + 云函数）。",
      "实现登录、角色与数据范围权限，以及销售、设计、财务、交付、电商、组织管理工作台。流程：新客户 → 合同 → 设计 → 财务审核 → 安装。云函数覆盖登录、修改密码、管理、审计日志和密码策略，并配有测试。",
      "团队项目「设计师家装服务平台」（基于芋道 yudao 商城版，不是个人独立完成）：负责后端业务模块的增删改查和管理端接口，参与设计师模块（档案、入驻审核、认证等级、预约排班、作品集、全景图、证书、评价、技能评分、收藏、通知等）与家装案例模块的业务接口、Service 和数据访问层。",
      "实习期间也做过一些视频制作。",
    ],
  },
  learning: [
    "网络基础：TCP/IP、HTTP/HTTPS、DNS",
    "Linux：命令行、权限、进程管理",
    "Web 安全：OWASP Top 10 原理与复现",
    "工具链：Burp Suite、Nmap、sqlmap",
    "实战：CTF 刷题与本地靶场",
  ],
};

export default function ResumeView() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 767px){ header { display: none !important; } }
            @media print {
              header, .no-print { display: none !important; }
              body { background: #fff !important; }
              .resume-sheet { box-shadow: none !important; border: none !important; }
            }
          `,
        }}
      />

      <div className="no-print mx-auto w-full max-w-4xl shrink-0 px-4 pt-16 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            返回作品集
          </Link>
          <Button onClick={() => window.print()}>
            <span className="flex gap-2 text-sm">
              <Download className="h-4 w-4" />
              打印 / 存为 PDF
            </span>
          </Button>
        </motion.div>
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ResumeDoodle>
            <article className="resume-sheet overflow-hidden rounded-2xl border border-border/70 bg-white text-[#1a1a1a] shadow-xl">
              <header className="border-b border-black/10 bg-[#0d1117] px-8 py-9 text-white md:px-12 md:py-11">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                      {config.author}
                    </h1>
                    <p className="mt-2 font-mono text-sm tracking-wide text-emerald-300">
                      {config.role}
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
                      {config.tagline}
                    </p>
                  </div>
                  <div className="space-y-1.5 font-mono text-[12px] text-zinc-300">
                    <a href={`mailto:${config.email}`} className="flex items-center gap-2 hover:text-emerald-300">
                      <Mail className="h-3.5 w-3.5" /> {config.email}
                    </a>
                    <a
                      href={config.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-emerald-300"
                    >
                      <Github className="h-3.5 w-3.5" /> github.com/Daylight-by
                    </a>
                    <a
                      href={config.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-emerald-300"
                    >
                      <Globe className="h-3.5 w-3.5" /> bsqdsq.top
                    </a>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" /> {config.location}
                    </p>
                  </div>
                </div>
              </header>

              <div className="grid gap-8 px-8 py-8 md:grid-cols-[1fr_1.9fr] md:gap-10 md:px-12 md:py-10">
                <aside className="space-y-7">
                  <section>
                    <h2 className="mb-3 border-b border-black/15 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black/50">
                      技能
                    </h2>
                    <div className="space-y-3">
                      {SECTIONS.skills.map((s) => (
                        <div key={s.group}>
                          <p className="text-[12px] font-semibold text-black/75">{s.group}</p>
                          <p className="mt-0.5 text-[12.5px] leading-relaxed text-black/60">
                            {s.items.join(" · ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="mb-3 border-b border-black/15 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black/50">
                      教育
                    </h2>
                    <p className="text-[13px] font-semibold">桂林信息科技学院</p>
                    <p className="mt-0.5 text-[12.5px] text-black/70">信息工程学院 · 软件工程</p>
                    <p className="mt-0.5 text-[12.5px] text-black/60">本科大三在读</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-black/55">
                      课程侧重 Java，也学过一些 Python、C#、C。
                    </p>
                    <p className="mt-1 text-[12px] text-black/45">
                      参与大学生创新创业训练计划（大创）
                    </p>
                  </section>

                  <section>
                    <h2 className="mb-3 border-b border-black/15 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black/50">
                      求职意向
                    </h2>
                    <p className="text-[13px] font-semibold">{SECTIONS.intent[0]}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-black/60">
                      {SECTIONS.intent[1]}
                    </p>
                  </section>

                  <section>
                    <h2 className="mb-3 border-b border-black/15 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black/50">
                      正在学
                    </h2>
                    <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-black/60">
                      {SECTIONS.learning.map((l) => (
                        <li key={l} className="flex gap-2">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-black/40" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </section>
                </aside>

                <main className="space-y-7">
                  <section>
                    <h2 className="mb-3 border-b border-black/15 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black/50">
                      简介
                    </h2>
                    <p className="text-[13px] leading-relaxed text-black/70">{SECTIONS.intro}</p>
                  </section>

                  <section>
                    <h2 className="mb-4 border-b border-black/15 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black/50">
                      实习经历
                    </h2>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-[14px] font-bold">{SECTIONS.internship.company}</h3>
                      <span className="font-mono text-[11px] text-black/45">{SECTIONS.internship.period}</span>
                    </div>
                    <p className="mt-0.5 text-[11.5px] font-medium text-black/50">{SECTIONS.internship.title}</p>
                    <ul className="mt-1.5 space-y-1 text-[12.5px] leading-relaxed text-black/65">
                      {SECTIONS.internship.points.map((pt) => (
                        <li key={pt} className="flex gap-2">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-black/35" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h2 className="mb-4 border-b border-black/15 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black/50">
                      项目经历
                    </h2>
                    <div className="space-y-5">
                      {SECTIONS.projects.map((p) => (
                        <div key={p.name}>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <h3 className="text-[14px] font-bold">{p.name}</h3>
                            <span className="font-mono text-[11px] text-black/45">{p.period}</span>
                          </div>
                          <p className="mt-0.5 text-[11.5px] font-medium text-black/50">{p.role}</p>
                          <ul className="mt-1.5 space-y-1 text-[12.5px] leading-relaxed text-black/65">
                            {p.points.map((pt) => (
                              <li key={pt} className="flex gap-2">
                                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-black/35" />
                                {pt}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-1.5 font-mono text-[11px] text-black/40">{p.stack}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </main>
              </div>

              <footer className="border-t border-black/10 px-8 py-4 text-center font-mono text-[10.5px] text-black/35 md:px-12">
                这份简历是网页渲染的 —— 可以直接在上面涂鸦，或者按 Ctrl / Cmd + P 存成 PDF。
              </footer>
            </article>
          </ResumeDoodle>
        </motion.div>
      </div>
    </div>
  );
}
