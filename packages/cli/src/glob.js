/*
 * Glob matching for `covers:` and `shared:` lines.
 *
 * `**` matches any number of folders (including none), `*` matches within one
 * path segment, `?` matches one character. Everything else is literal,
 * including the brackets and parentheses Next.js uses in route folders, so
 * `src/app/(auth)/**` and `src/app/boards/[boardId]/page.tsx` mean what they say.
 */

const cache = new Map()

export function globToRegExp(glob) {
  let re = ""
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i]
    if (c === "*" && glob[i + 1] === "*") {
      if (glob[i + 2] === "/") {
        re += "(?:.*/)?" // "**/" is zero or more folders
        i += 2
      } else {
        re += ".*" // a trailing "**" is everything below
        i += 1
      }
    } else if (c === "*") {
      re += "[^/]*"
    } else if (c === "?") {
      re += "[^/]"
    } else {
      re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&")
    }
  }
  return new RegExp(`^${re}$`)
}

export function matches(path, glob) {
  let re = cache.get(glob)
  if (!re) {
    re = globToRegExp(glob)
    cache.set(glob, re)
  }
  return re.test(path)
}

export function matchesAny(path, globs) {
  return globs.some((glob) => matches(path, glob))
}
