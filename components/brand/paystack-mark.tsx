import { cn } from "@/lib/utils"

export function PaystackMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] text-muted-foreground", className)}>
      <span className="inline-flex size-4 items-center justify-center rounded-[4px] bg-[#00C3F7] text-[10px] font-semibold text-[#0A0A0A]">
        P
      </span>
      Secured by Paystack
    </span>
  )
}
