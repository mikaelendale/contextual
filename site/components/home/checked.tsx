import { CheckRun } from "@/components/home/check-run"
import { Lede, Section, SectionTitle } from "@/components/home/section"

export function Checked() {
  return (
    <Section id="checked">
      <div className="mx-auto max-w-[44rem] text-center">
        <SectionTitle lead="Done means" accent="checked, not claimed." />
        <Lede className="mx-auto">
          A passing build isn&rsquo;t proof. Before it calls a feature done, your agent looks at every screen it changed,
          runs the design checklist and writes down what it saw. The git hook won&rsquo;t let a commit skip the record.
        </Lede>
      </div>
      <div className="mt-12">
        <CheckRun />
      </div>
    </Section>
  )
}
