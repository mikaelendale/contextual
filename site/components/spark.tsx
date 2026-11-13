/** The sky's four-point star, with soft, slightly concave sides. Also marks what an agent reads first. */
export function Spark({ className }: { className?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true" className={className}>
      <path d="M0 -50C4 -14 14 -4 50 0C14 4 4 14 0 50C-4 14 -14 4 -50 0C-14 -4 -4 -14 0 -50Z" fill="currentColor" />
    </svg>
  )
}
