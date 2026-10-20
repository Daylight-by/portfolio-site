"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Terminal as TerminalIcon, X } from "lucide-react";
import { config } from "@/data/config";
import { ROOT, VNode, allNames, listDir, resolve } from "./fs";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  输出行                                                             */
/* ------------------------------------------------------------------ */

type Tone = "plain" | "dim" | "accent" | "ok" | "err" | "cmd" | "head";

type Line = { text: string; tone?: Tone; href?: string };

const toneClass: Record<Tone, string> = {
  plain: "text-foreground/90",
  dim: "text-muted-foreground",
  accent: "text-emerald-400 dark:text-emerald-300",
  ok: "text-sky-400 dark:text-sky-300",
  err: "text-rose-400",
  cmd: "text-foreground",
  head: "text-foreground font-semibold",
};

const PROMPT_USER = "daylight";
const PROMPT_HOST = "bsqdsq";

const BANNER: Line[] = [
  { text: "Daylight · Portfolio Terminal  v1.0", tone: "head" },
  { text: "", tone: "plain" },
  { text: "输入 help 看全部命令，或者直接敲下面这几个：", tone: "dim" },
  { text: "", tone: "plain" },
  { text: "  whoami     我是谁", tone: "plain" },
  { text: "  projects   看看做过什么", tone: "plain" },
  { text: "  blog       读文章", tone: "plain" },
  { text: "  contact    怎么找到我", tone: "plain" },
  { text: "", tone: "plain" },
  { text: "↑ ↓ 翻历史　Tab 补全　Esc 关闭", tone: "dim" },
  { text: "", tone: "plain" },
];

/* ------------------------------------------------------------------ */
/*  命令实现                                                           */
/* ------------------------------------------------------------------ */

type Ctx = {
  cwd: string[];
  setCwd: (p: string[]) => void;
  setTheme: (t: string) => void;
  push: (lines: Line[] | ((prev: Line[]) => Line[])) => void;
  close: () => void;
  router: ReturnType<typeof useRouter>;
};

function pwdStr(cwd: string[]) {
  return cwd.length ? "~/" + cwd.join("/") : "~";
}

function pad(s: string, n: number) {
  // 中文按两格算，让 ls 对得齐
  let w = 0;
  for (const ch of s) w += /[\u4e00-\u9fa5]/.test(ch) ? 2 : 1;
  return s + " ".repeat(Math.max(0, n - w));
}

function run(raw: string, ctx: Ctx) {
  const input = raw.trim();
  if (!input) return;

  const [cmd, ...args] = input.split(/\s+/);
  const arg = args.join(" ");
  const out: Line[] = [];

  const ok = (text: string, tone: Tone = "plain") => out.push({ text, tone });

  switch (cmd.toLowerCase()) {
    /* ---------------- 帮助 ---------------- */
    case "help":
    case "?":
    case "man": {
      out.push({ text: "可用命令", tone: "head" });
      out.push({ text: "────────────────────────────────────────────", tone: "dim" });
      const rows: [string, string][] = [
        ["help", "显示这份帮助"],
        ["whoami", "一句话介绍"],
        ["ls [目录]", "列目录（加 -l 看说明）"],
        ["cd <目录>", "切目录，cd .. 返回，cd ~ 回根"],
        ["pwd", "当前路径"],
        ["cat <文件>", "读文件（show 是它的别名）"],
        ["tree", "整棵树"],
        ["projects", "项目列表"],
        ["blog", "文章列表"],
        ["open <名字>", "打开项目或文章"],
        ["resume", "跳到简历页"],
        ["contact", "联系方式"],
        ["theme <dark|light>", "换配色"],
        ["date", "现在几点"],
        ["clear", "清屏"],
        ["exit", "关掉终端"],
      ];
      for (const [c, d] of rows) ok("  " + pad(c, 24) + d);
      out.push({ text: "", tone: "plain" });
      ok("提示：Tab 可以补全，↑↓ 翻历史。", "dim");
      break;
    }

    /* ---------------- 身份 ---------------- */
    case "whoami":
      out.push({ text: config.author, tone: "head" });
      out.push({ text: config.tagline, tone: "plain" });
      out.push({ text: "", tone: "plain" });
      ok("方向    " + config.role);
      ok("位置    " + config.location);
      ok("状态    在学，在写，在做。");
      out.push({ text: "", tone: "plain" });
      ok("想了解更多：cat about.md", "dim");
      break;

    case "id":
      ok("uid=1000(daylight) gid=1000(daylight) groups=dev,security", "dim");
      break;

    /* ---------------- 文件系统 ---------------- */
    case "pwd":
      ok("/home/daylight" + (ctx.cwd.length ? "/" + ctx.cwd.join("/") : ""));
      break;

    case "ls": {
      const long = args.includes("-l") || args.includes("-la");
      const rest = args.filter((a) => !a.startsWith("-"));
      const targetNode = rest.length ? resolveTarget(rest[0], ctx.cwd) : resolve(ctx.cwd);
      if (!targetNode) {
        ok("ls: 没有这个目录: " + rest[0], "err");
        break;
      }
      if (targetNode.kind !== "dir") {
        ok(rest[0]);
        break;
      }
      const items = targetNode.children ?? [];
      if (!items.length) {
        ok("（空）", "dim");
        break;
      }
      if (long) {
        for (const it of items) {
          const name = it.kind === "dir" ? it.name + "/" : it.name;
          ok(
            (it.kind === "dir" ? "drwxr-xr-x  " : "-rw-r--r--  ") +
              pad(name, 34) +
              (it.hint ?? ""),
            it.kind === "dir" ? "ok" : "plain"
          );
        }
      } else {
        ok(
          items
            .map((it) => (it.kind === "dir" ? it.name + "/" : it.name))
            .join("   ")
        );
      }
      break;
    }

    case "cd": {
      if (!arg || arg === "~" || arg === "/") {
        ctx.setCwd([]);
        break;
      }
      const next = resolveTarget(arg, ctx.cwd);
      if (!next) {
        ok("cd: 没有这个目录: " + arg, "err");
        break;
      }
      if (next.kind !== "dir") {
        ok("cd: 不是一个目录: " + arg, "err");
        break;
      }
      ctx.setCwd(pathOf(arg, ctx.cwd));
      break;
    }

    case "cat":
    case "show":
    case "less":
    case "more": {
      if (!arg) {
        ok("用法: cat <文件名>", "err");
        break;
      }
      const node = resolveTarget(arg, ctx.cwd);
      if (!node) {
        ok("cat: 找不到: " + arg, "err");
        ok("试试 ls 看看有哪些文件。", "dim");
        break;
      }
      if (node.kind === "dir") {
        ok("cat: " + arg + " 是个目录", "err");
        break;
      }
      out.push(...renderMarkdown(node.content ?? ""));
      if (node.href) {
        out.push({ text: "", tone: "plain" });
        out.push({ text: "→ 在线阅读：", tone: "dim" });
        out.push({ text: node.href, tone: "accent", href: node.href });
      }
      break;
    }

    case "tree": {
      const walk = (node: VNode, prefix: string, isLast: boolean, depth: number) => {
        const branch = depth === 0 ? "" : isLast ? "└── " : "├── ";
        const label = node.kind === "dir" ? node.name + "/" : node.name;
        out.push({
          text: prefix + branch + label,
          tone: node.kind === "dir" ? "ok" : "plain",
        });
        if (node.kind === "dir" && node.children) {
          const childPrefix = prefix + (depth === 0 ? "" : isLast ? "    " : "│   ");
          node.children.forEach((c, i) =>
            walk(c, childPrefix, i === node.children!.length - 1, depth + 1)
          );
        }
      };
      walk(ROOT, "", true, 0);
      break;
    }

    /* ---------------- 内容导航 ---------------- */
    case "projects": {
      ok("项目", "head");
      ok("────────────────────────────────────────────", "dim");
      const items = listDir(["projects"]);
      items.forEach((it, i) => {
        ok("");
        out.push({ text: `  ${i + 1}. ${it.name.replace(/\.md$/, "")}`, tone: "accent" });
        ok("     " + (it.hint ?? ""));
        ok("     cat projects/" + it.name, "dim");
      });
      ok("");
      ok("全部在 /#projects 页面上有更完整的版本。", "dim");
      break;
    }

    case "blog":
    case "posts": {
      ok("文章", "head");
      ok("────────────────────────────────────────────", "dim");
      const items = listDir(["blog"]);
      items.forEach((it) => {
        out.push({ text: `  ${it.hint ?? "----"}   ${it.name.replace(/\.md$/, "")}`, tone: "plain" });
        ok("                 cat blog/" + it.name, "dim");
      });
      ok("");
      ok("或者直接去 /blogs", "dim");
      break;
    }

    case "open": {
      if (!arg) {
        ok("用法: open <项目名|文章名>", "err");
        ok("可以先用 projects 或 blog 看看有什么。", "dim");
        break;
      }
      const cfg = openTargets[arg.toLowerCase()];
      if (!cfg) {
        ok("open: 不认识 " + arg, "err");
        break;
      }
      ok("正在打开 " + cfg.label + " …", "ok");
      ctx.close();
      setTimeout(() => {
        if (cfg.external) window.open(cfg.external, "_blank", "noopener");
        else ctx.router.push(cfg.href);
      }, 160);
      break;
    }

    case "resume":
      ok("跳转到简历页 …", "ok");
      ctx.close();
      setTimeout(() => ctx.router.push("/resume"), 160);
      break;

    case "contact": {
      ok("联系方式", "head");
      ok("────────────────────────────────────────────", "dim");
      ok("  邮箱      " + config.email);
      out.push({ text: "  GitHub    " + config.social.github, tone: "plain", href: config.social.github });
      out.push({ text: "  站点      " + config.site, tone: "plain", href: config.site });
      ok("  位置      " + config.location);
      ok("");
      ok("邮件是我看得最勤的渠道。", "dim");
      break;
    }

    /* ---------------- 杂项 ---------------- */
    case "theme": {
      const t = arg.toLowerCase();
      if (t === "dark" || t === "light") {
        ctx.setTheme(t);
        ok("已切换到 " + (t === "dark" ? "暗色" : "浅色") + "模式。", "ok");
      } else {
        const cur = document.documentElement.classList.contains("dark") ? "dark" : "light";
        const next = cur === "dark" ? "light" : "dark";
        ctx.setTheme(next);
        ok("已切换到 " + (next === "dark" ? "暗色" : "浅色") + "模式。", "ok");
        ok("下次想直接指定：theme dark / theme light", "dim");
      }
      break;
    }

    case "date":
    case "time": {
      const now = new Date();
      ok(
        now.toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          weekday: "long",
        })
      );
      break;
    }

    case "echo":
      ok(arg);
      break;

    case "clear":
      ctx.push([]);
      return;

    case "exit":
    case "quit":
    case "q":
      ctx.close();
      return;

    /* ---------------- 彩蛋 ---------------- */
    case "sudo": {
      ok("daylight 不在 sudoers 文件中。此事将被报告。", "err");
      ok("……开玩笑的，这里没有权限系统。", "dim");
      break;
    }

    case "coffee":
      ok("☕ 正在冲咖啡…", "plain");
      ok("完成后将自动继续工作。（其实不会）", "dim");
      break;

    case "matrix": {
      ok("Wake up, Neo…", "accent");
      ok("The Matrix has you…", "accent");
      ok("Follow the white rabbit. 🐇", "accent");
      ok("");
      ok("（真正的 matrix 效果在 3D 键盘那一屏，往下滚）", "dim");
      break;
    }

    case "rm": {
      if (arg.includes("-rf") || arg.includes("/")) {
        ok("rm: 想得美。", "err");
        ok("这个终端是只读的，你的文件很安全。", "dim");
      } else {
        ok("rm: 这个终端是只读的。", "dim");
      }
      break;
    }

    case "neofetch": {
      ok("        ▄▄▄▄▄        " + PROMPT_USER + "@" + PROMPT_HOST, "accent");
      ok("     ▄█████████▄     ─────────────────", "accent");
      ok("    ███▀     ▀███    OS      静态导出的 Next.js", "accent");
      ok("   ███   ▄▄▄   ███   Shell   daylight-sh 1.0", "accent");
      ok("   ███  █████  ███   Theme   " + (typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light"), "accent");
      ok("    ███▄     ▄███    CPU     你的浏览器", "accent");
      ok("     ▀█████████▀     Memory  够用", "accent");
      ok("        ▀▀▀▀▀        ", "accent");
      break;
    }

    default:
      ok(`command not found: ${cmd}`, "err");
      ok("输入 help 看看有哪些命令。", "dim");
  }

  ctx.push((prev) => [...prev, { text: `${PROMPT_USER}@${PROMPT_HOST}:${pwdStr(ctx.cwd)}$ ${input}`, tone: "cmd" }, ...out, { text: "", tone: "plain" }]);
}

/* ------------------------------------------------------------------ */

const openTargets: Record<string, { label: string; href: string; external?: string }> = {
  "knowledge-hub": { label: "知识库与 Agent 工作流", href: "/#projects" },
  "knowledge": { label: "知识库与 Agent 工作流", href: "/#projects" },
  "知识库": { label: "知识库与 Agent 工作流", href: "/#projects" },
  "huana-mall": { label: "电商小程序", href: "/#projects" },
  "电商小程序": { label: "电商小程序", href: "/#projects" },
  hotel: { label: "酒店管理系统", href: "/#projects" },
  "hotel-management": { label: "酒店管理系统", href: "/#projects" },
  "酒店": { label: "酒店管理系统", href: "/#projects" },
  portfolio: { label: "本站", href: "/#projects" },
  site: { label: "本站", href: "/#projects" },
  "hello-world": { label: "博客搭建完成", href: "/blogs/hello-world" },
  "hotel-management-springboot": {
    label: "酒店管理系统 · Spring Boot 全栈项目",
    href: "/blogs/hotel-management-springboot",
  },
  github: {
    label: "GitHub",
    href: "",
    external: "https://github.com/Daylight-by",
  },
};

function resolveTarget(arg: string, cwd: string[]): VNode | null {
  const clean = arg.replace(/\/+$/, "");
  if (clean === "." || clean === "./") return resolve(cwd);
  if (clean === "~" || clean === "/") return ROOT;
  if (clean.startsWith("~/")) return resolve(clean.slice(2).split("/"));
  return resolve([...cwd, ...clean.split("/")]);
}

function pathOf(arg: string, cwd: string[]): string[] {
  if (arg === "..") return cwd.slice(0, -1);
  if (arg.startsWith("~/")) return arg.slice(2).split("/").filter(Boolean);
  if (arg.startsWith("/")) return arg.split("/").filter(Boolean);
  return [...cwd, ...arg.split("/").filter(Boolean)];
}

/** 把纯文本 markdown 转成带语气色的行 */
function renderMarkdown(src: string): Line[] {
  const out: Line[] = [];
  for (const raw of src.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) {
      out.push({ text: "", tone: "plain" });
      continue;
    }
    if (line.startsWith("## ")) {
      out.push({ text: line.slice(3), tone: "head" });
    } else if (line.startsWith("# ")) {
      out.push({ text: line.slice(2), tone: "head" });
      out.push({ text: "────────────────────────────────────────────", tone: "dim" });
    } else if (/^https?:\/\//.test(line.trim())) {
      out.push({ text: "  " + line.trim(), tone: "accent", href: line.trim() });
    } else if (line.startsWith("- ") || /^\d+\.\s/.test(line)) {
      out.push({ text: "  " + line, tone: "plain" });
    } else {
      out.push({ text: line, tone: "plain" });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  UI                                                                 */
/* ------------------------------------------------------------------ */

export default function Terminal() {
  const [open, setOpen] = React.useState(false);
  const [lines, setLines] = React.useState<Line[]>(BANNER);
  const [value, setValue] = React.useState("");
  const [cwd, setCwd] = React.useState<string[]>([]);
  const [history, setHistory] = React.useState<string[]>([]);
  const [histIndex, setHistIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setTheme } = useTheme();

  const push = React.useCallback((next: Line[] | ((prev: Line[]) => Line[])) => {
    setLines((prev) => (typeof next === "function" ? (next as any)(prev) : next));
  }, []);

  /* 全局快捷键 */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open && e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* 打开时聚焦 + 锁滚动 */
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* 自动滚到底 */
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const submit = (raw: string) => {
    const cmd = raw.trim();
    setHistory((h) => (cmd ? [...h, cmd] : h));
    setHistIndex(-1);
    setValue("");
    if (!cmd) {
      push((prev) => [...prev, { text: `${PROMPT_USER}@${PROMPT_HOST}:${pwdStr(cwd)}$ `, tone: "cmd" }]);
      return;
    }
    run(cmd, {
      cwd,
      setCwd,
      setTheme: (t) => setTheme(t),
      push,
      close: () => setOpen(false),
      router,
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const i = histIndex < 0 ? history.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(i);
      setValue(history[i]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex < 0) return;
      const i = histIndex + 1;
      if (i >= history.length) {
        setHistIndex(-1);
        setValue("");
      } else {
        setHistIndex(i);
        setValue(history[i]);
      }
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const parts = value.split(/\s+/);
      const last = parts[parts.length - 1] ?? "";
      if (!last) return;
      const pool = allNames();
      const hit = pool.find((n) => n.startsWith(last));
      if (hit && hit !== last) {
        parts[parts.length - 1] = hit;
        setValue(parts.join(" "));
      }
      return;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      push([]);
    }
  };

  return (
    <>
      {/* 唤起按钮 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="打开终端"
        className={cn(
          "fixed bottom-5 right-5 z-[900] hidden md:flex items-center gap-2",
          "rounded-full border border-border/70 bg-background/80 px-4 py-2.5",
          "font-mono text-xs text-muted-foreground shadow-lg backdrop-blur-md",
          "transition-all hover:border-emerald-400/60 hover:text-foreground hover:shadow-emerald-500/10",
          open && "pointer-events-none opacity-0"
        )}
      >
        <TerminalIcon className="h-3.5 w-3.5" />
        <span>终端</span>
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">
          Ctrl K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="terminal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[2000] flex items-start justify-center bg-background/80 px-3 pt-[6vh] backdrop-blur-md md:pt-[10vh]"
            onClick={() => inputRef.current?.focus()}
            data-lenis-prevent
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "flex w-full max-w-3xl flex-col overflow-hidden rounded-xl",
                "border border-border/80 bg-background/95 shadow-2xl",
                "h-[76dvh] md:h-[70dvh]"
              )}
              role="dialog"
              aria-label="终端"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 标题栏 */}
              <div className="flex shrink-0 items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-2">
                    {PROMPT_USER}@{PROMPT_HOST}: {pwdStr(cwd)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="关闭终端"
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 输出区 */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 font-mono text-[13px] leading-relaxed md:text-[13.5px]"
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((l, i) => (
                  <div key={i} className={cn("whitespace-pre-wrap break-words", toneClass[l.tone ?? "plain"])}>
                    {l.href ? (
                      <a
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="underline decoration-dotted underline-offset-2 hover:opacity-80"
                      >
                        {l.text}
                      </a>
                    ) : (
                      l.text || "\u00A0"
                    )}
                  </div>
                ))}

                {/* 输入行 */}
                <div className="mt-1 flex items-baseline gap-0 font-mono text-[13px] md:text-[13.5px]">
                  <span className="shrink-0 text-emerald-400 dark:text-emerald-300">
                    {PROMPT_USER}@{PROMPT_HOST}
                  </span>
                  <span className="shrink-0 text-muted-foreground">:{pwdStr(cwd)}$&nbsp;</span>
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    aria-label="输入命令"
                    className="min-w-0 flex-1 bg-transparent font-mono text-foreground outline-none placeholder:text-muted-foreground/50"
                    placeholder=""
                  />
                </div>
              </div>

              {/* 常用命令（手机端尤其需要：没键盘） */}
              <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-border/60 bg-muted/30 px-3 py-2.5">
                {[
                  ["help", "帮助"],
                  ["whoami", "关于我"],
                  ["projects", "项目"],
                  ["blog", "文章"],
                  ["contact", "联系"],
                  ["theme", "换配色"],
                ].map(([cmd, label]) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => {
                      submit(cmd);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-emerald-400/50 hover:text-foreground"
                  >
                    {label}
                  </button>
                ))}
                <span className="ml-auto hidden items-center font-mono text-[10px] text-muted-foreground/60 sm:flex">
                  Esc 关闭
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
