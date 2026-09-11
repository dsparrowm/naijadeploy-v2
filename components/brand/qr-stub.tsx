import { cn } from "@/lib/utils"

/** Deterministic stub QR — visual only, not a live TOTP enrollment. */
export function QrStub({
  className,
  label = "ND-2FA-7K4M-QP2X",
}: {
  className?: string
  label?: string
}) {
  const cells = qrCells(label)
  return (
    <div className={cn("inline-flex rounded-[7px] border border-border bg-[#FAFAFA] p-2.5", className)}>
      <svg viewBox="0 0 21 21" className="size-[132px]" aria-hidden="true">
        {cells.map((on, i) =>
          on ? (
            <rect
              key={i}
              x={i % 21}
              y={Math.floor(i / 21)}
              width="1"
              height="1"
              fill="#0A0A0A"
            />
          ) : null,
        )}
      </svg>
    </div>
  )
}

function qrCells(seed: string) {
  const size = 21
  const cells = Array<boolean>(size * size).fill(false)
  const hash = (n: number) => {
    let x = n
    for (let i = 0; i < seed.length; i += 1) x = (x * 33 + seed.charCodeAt(i)) >>> 0
    return x
  }
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const inFinder =
        (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13)
      if (inFinder) continue
      cells[y * size + x] = ((hash(x * 31 + y * 17) >> (x % 8)) & 1) === 1
    }
  }
  drawFinder(cells, size, 0, 0)
  drawFinder(cells, size, 14, 0)
  drawFinder(cells, size, 0, 14)
  return cells
}

function drawFinder(cells: boolean[], size: number, ox: number, oy: number) {
  for (let y = 0; y < 7; y += 1) {
    for (let x = 0; x < 7; x += 1) {
      const edge = x === 0 || y === 0 || x === 6 || y === 6
      const core = x >= 2 && x <= 4 && y >= 2 && y <= 4
      cells[(oy + y) * size + (ox + x)] = edge || core
    }
  }
}
