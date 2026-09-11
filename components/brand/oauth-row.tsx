import { Github, Gitlab } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OauthRow({
  onStub,
  labels = { github: "GitHub", gitlab: "GitLab" },
}: {
  onStub?: () => void
  labels?: { github: string; gitlab: string }
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button type="button" variant="outline" className="h-10" onClick={onStub}>
        <Github className="size-3.5" />
        {labels.github}
      </Button>
      <Button type="button" variant="outline" className="h-10" onClick={onStub}>
        <Gitlab className="size-3.5" />
        {labels.gitlab}
      </Button>
    </div>
  )
}

export function OrDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      {label}
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
