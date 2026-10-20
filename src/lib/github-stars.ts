import { config } from "@/data/config";

// 静态导出（GitHub Pages）环境：没有服务端缓存，也没有 "use cache"。
// 这里改为构建时抓取一次并固化进 HTML。
// 国内网络访问 api.github.com 可能长时间无响应，必须自带超时：
// 超时 / 失败一律降级为 0，绝不让构建卡死在这里。
export async function getGithubStars(): Promise<number> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${config.githubUsername}/${config.githubRepo}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      },
    );
    if (!res.ok) return 0;

    const data = await res.json();
    if (typeof data.stargazers_count !== "number") return 0;
    return data.stargazers_count;
  } catch {
    return 0;
  }
}
