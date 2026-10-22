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
    "计算机专业在读。从 Java 全栈起步，独立做过从零到线上的完整项目；现在主攻网络安全，同时把 AI Agent 往真实场景里落。习惯把踩过的坑写成文档 —— 写不出来，说明还没懂。",
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
        "目标是「喂进去资料，它自己长出知识结构」，而不是又一个聊天框。",
        "已跑通文档解析入库、向量检索、Agent 编排、工作流可视化。",
        "正在攻长文档切分的语义边界、多轮检索的上下文预算、工具调用的失败重试。",
      ],
      stack: "Next.js · TypeScript · PostgreSQL · Docker",
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
                    <p className="text-[13px] font-semibold">本科 · 在读</p>
                    <p className="mt-0.5 text-[12.5px] text-black/60">计算机相关专业</p>
                    <p className="mt-1 text-[12px] text-black/45">
                      参与大学生创新创业训练计划（大创）
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
