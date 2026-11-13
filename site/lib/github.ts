import { cacheLife } from "next/cache"

import { REPO_NAME } from "@/lib/links"

export type RepoStats = {
  stars: number
  forks: number
  contributors: number
  commits: number
  license: string | null
  pushedAt: string
  description: string | null
}

const API = `https://api.github.com/repos/${REPO_NAME}`

/** The total behind a paginated list asked for one item per page: the last page's number. */
function countFromLink(res: Response, firstPage: unknown[]): number {
  const last = res.headers.get("link")?.match(/[?&]page=(\d+)>; rel="last"/)
  return last ? Number(last[1]) : firstPage.length
}

/**
 * The repo's public numbers from GitHub's API, kept for an hour. Only our
 * server asks GitHub, so visitors never talk to it. Without a token GitHub
 * allows 60 requests an hour, and this makes 3 an hour. If GitHub doesn't
 * answer, the button shows no numbers and the server asks again a minute later.
 */
export async function getRepoStats(): Promise<RepoStats | null> {
  "use cache"
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  }
  try {
    const [repo, contributors, commits] = await Promise.all([
      fetch(API, { headers }),
      fetch(`${API}/contributors?per_page=1&anon=1`, { headers }),
      fetch(`${API}/commits?per_page=1`, { headers }),
    ])
    if (!repo.ok || !contributors.ok || !commits.ok) throw new Error(`GitHub answered ${repo.status}`)
    const data = (await repo.json()) as {
      stargazers_count: number
      forks_count: number
      license: { spdx_id: string } | null
      pushed_at: string
      description: string | null
    }
    const stats: RepoStats = {
      stars: data.stargazers_count,
      forks: data.forks_count,
      contributors: countFromLink(contributors, (await contributors.json()) as unknown[]),
      commits: countFromLink(commits, (await commits.json()) as unknown[]),
      license: data.license?.spdx_id && data.license.spdx_id !== "NOASSERTION" ? data.license.spdx_id : null,
      pushedAt: data.pushed_at,
      description: data.description,
    }
    cacheLife("hours")
    return stats
  } catch {
    cacheLife("minutes")
    return null
  }
}
