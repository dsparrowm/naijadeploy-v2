import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = ["Connect Git", "Configure", "Deploy"] as const

export function FlowStepper({ step }: { step: 0 | 1 | 2 }) {
  return (
    <ol className="flex items-center gap-4 text-[13px]">
      {STEPS.map((label, index) => {
        const done = index < step
        const current = index === step
        return (
          <li key={label} className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full text-[12px] font-medium",
                  done && "bg-success text-white",
                  current && "bg-primary text-primary-foreground",
                  !done && !current && "border border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  current && "font-medium text-foreground",
                  done && "text-success",
                  !done && !current && "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </span>
            {index < STEPS.length - 1 ? (
              <span className="block h-px w-8 bg-border" aria-hidden="true" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
