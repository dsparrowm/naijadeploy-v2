import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Pixel-positioned illustration at the mockup's desktop size.
 * Scales down with the column so the same coordinates hold on mobile.
 */
export function SceneFrame({
  width,
  height,
  children,
  className,
}: {
  width: number
  height: number
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn("relative mx-auto w-full lg:mx-0", className)}
      style={{
        maxWidth: width,
        aspectRatio: `${width} / ${height}`,
        containerType: "inline-size",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          transformOrigin: "top left",
          transform: `scale(calc(100cqw / ${width}px))`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
