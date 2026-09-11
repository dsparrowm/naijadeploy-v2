export function formatNaira(amountNaira: number) {
  return `₦${amountNaira.toLocaleString("en-NG")}`
}

export function formatKoboAsNaira(amountKobo: number) {
  return formatNaira(Math.round(amountKobo / 100))
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}
