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

export function formatRelative(iso: string) {
  const then = new Date(iso).getTime()
  const delta = Date.now() - then
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  if (delta < minute) return "Just now"
  if (delta < hour) return `${Math.max(1, Math.round(delta / minute))}m ago`
  if (delta < day) return `${Math.max(1, Math.round(delta / hour))}h ago`
  if (delta < 2 * day) return "Yesterday"
  if (delta < 7 * day) return `${Math.round(delta / day)}d ago`
  return formatDate(iso)
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "ND"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export function shortName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return name
  return `${parts[0]} ${parts[1][0].toUpperCase()}.`
}

export function repoInitials(fullName: string) {
  const repo = fullName.split("/")[1] || fullName
  const bits = repo.split(/[-_]/).filter(Boolean)
  if (bits.length >= 2) return `${bits[0][0]}${bits[1][0]}`.toUpperCase()
  return repo.slice(0, 2).toUpperCase()
}
