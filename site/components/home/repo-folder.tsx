import { Lede, Section, SectionTitle } from "@/components/home/section"
import { RepoMap } from "@/components/home/repo-map"

export function RepoFolder() {
  return (
    <Section id="repo">
      <div className="mx-auto max-w-[44rem] text-center">
        <SectionTitle lead="Your project's memory is" accent="a folder you can read." />
        <Lede className="mx-auto">
          Plain markdown next to your code. It branches and merges with the code, and you review it in pull requests
          like anything else. Your agent reads four of these files before every task and writes three after.
        </Lede>
      </div>
      <div className="mt-12">
        <RepoMap />
      </div>
    </Section>
  )
}
