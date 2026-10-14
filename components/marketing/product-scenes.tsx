import { JetBrains_Mono } from "next/font/google"
import { SceneFrame } from "@/components/marketing/scene-frame"
import {
  backendIllustration,
  deploymentOrbit,
  exampleEnvVars,
  exampleLabels,
  heroIllustration,
  pipelineIllustration,
  requestChart,
} from "@/lib/marketing/example-content"
import { DEFAULT_REGION, PRODUCT_DOMAIN, PRO_PLAN, projectUrl } from "@/lib/config"
import { formatNaira } from "@/lib/format"
import { cn } from "@/lib/utils"

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
})

function projectHost(slug: string) {
  return new URL(projectUrl(slug)).host
}

const card =
  "rounded-[12px] border border-[#eceef3] bg-white shadow-[0_12px_30px_-12px_rgba(20,20,51,0.18)]"

export function HeroScene() {
  const proPrice = formatNaira(PRO_PLAN.priceNaira)

  return (
    <SceneFrame width={490} height={400} className="mx-auto w-full max-w-[490px]">
      <div className={cn(card, "absolute left-0 top-10 z-10 w-[260px] p-4")}>
        <p className="text-xs text-zinc-500">{heroIllustration.projectPath}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-[8px] bg-zinc-50 p-3">
            <p className="text-[10px] text-zinc-500">{heroIllustration.statusLabel}</p>
            <p className="font-bold text-[#15803d]">● {heroIllustration.statusValue}</p>
          </div>
          <div className="rounded-[8px] bg-zinc-50 p-3">
            <p className="text-[10px] text-zinc-500">{heroIllustration.latencyLabel}</p>
            <p className="font-bold text-[#141433]">{heroIllustration.latencyValue}</p>
          </div>
        </div>
        <ul className="mt-3 space-y-1.5 text-xs">
          {heroIllustration.deploys.map((row) => (
            <li key={row.message} className="flex items-center justify-between gap-3">
              <span className="truncate text-[#141433]">{row.message}</span>
              <span className={row.tone === "accent" ? "shrink-0 font-medium text-[#c04347]" : "shrink-0 text-zinc-400"}>
                {row.state}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute left-[290px] top-0 h-[390px] w-[200px] rounded-[34px] bg-[#141433] p-2.5 shadow-2xl">
        <div className="flex h-full flex-col rounded-[26px] bg-white p-4">
          <p className="text-center text-[10px] text-zinc-400">{PRODUCT_DOMAIN}</p>
          <p className="mt-4 text-sm font-bold text-[#141433]">Upgrade to Pro</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-[#141433]">
            {proPrice}
            <span className="text-xs font-normal text-zinc-500">/mo</span>
          </p>
          <ul className="mt-3 space-y-1 text-[11px] text-zinc-600">
            {heroIllustration.phoneFeatures.map((feature) => (
              <li key={feature}>✓ {feature}</li>
            ))}
          </ul>
          <div className="mt-5 rounded-full bg-[#f2545b] py-2 text-center text-xs font-semibold text-white">
            Pay with Paystack
          </div>
          <p className="mt-2 text-center text-[10px] text-zinc-400">{heroIllustration.phoneMethods}</p>
        </div>
      </div>

      <div className={cn(card, mono.className, "absolute left-[30px] top-[280px] z-10 w-[170px] p-3 text-[11px]")}>
        <p className="text-zinc-400">{heroIllustration.command}</p>
        <p className="text-[#15803d]">✓ {heroIllustration.commandResult}</p>
      </div>
    </SceneFrame>
  )
}

export function BackendScene() {
  return (
    <SceneFrame width={496} height={380}>
      <div className="absolute left-[40px] top-[150px] grid size-20 place-items-center rounded-full bg-[#141433] text-sm font-bold text-white">
        Git
      </div>
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <line x1="120" y1="190" x2="300" y2="190" stroke="#e5e5ee" strokeWidth="2" />
        <line x1="300" y1="190" x2="420" y2="60" stroke="#e5e5ee" strokeWidth="2" />
        <line x1="300" y1="190" x2="420" y2="190" stroke="#e5e5ee" strokeWidth="2" />
        <line x1="300" y1="190" x2="420" y2="320" stroke="#e5e5ee" strokeWidth="2" />
      </svg>
      <div className="absolute left-[255px] top-[145px] grid size-24 place-items-center rounded-full bg-[#f2545b] text-center text-xs font-black leading-tight text-white">
        Naija
        <br />
        Deploy
      </div>
      <div className={cn(card, "absolute right-0 top-[30px] w-[170px] p-3 text-xs")}>
        <p className="font-bold text-[#141433]">{DEFAULT_REGION.label}</p>
        <p className="text-zinc-500">{backendIllustration.edgeStatus}</p>
      </div>
      <div className={cn(card, "absolute right-0 top-[160px] w-[170px] p-3 text-xs")}>
        <p className="font-bold text-[#141433]">{backendIllustration.domain}</p>
        <p className="text-[#15803d]">✓ {backendIllustration.domainStatus}</p>
      </div>
      <div className={cn(card, "absolute right-0 top-[290px] w-[170px] p-3 text-xs")}>
        <p className="font-bold text-[#141433]">{backendIllustration.previewTitle}</p>
        <p className="text-zinc-500">{projectHost(heroIllustration.previewSlug)}</p>
      </div>
    </SceneFrame>
  )
}

export function MetricsChart() {
  return (
    <div className={cn(card, "p-6")}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="font-bold text-[#141433]">{requestChart.title}</p>
        <p className="text-zinc-400">{requestChart.range}</p>
      </div>
      <p className="mt-2 text-3xl font-black tracking-tight text-[#141433]">
        {requestChart.total}{" "}
        <span className="align-middle text-[10px] font-normal text-[#6e6e86]">{exampleLabels.chart}</span>
      </p>
      <div className="mt-5 flex h-[180px] items-end gap-2" aria-hidden="true">
        {requestChart.weeks.map((week, index) => (
          <div key={index} className="flex h-full flex-1 flex-col justify-end overflow-hidden">
            <div className="shrink-0" style={{ height: week.portHarcourt, background: "#f9c74f" }} />
            <div className="shrink-0" style={{ height: week.abuja, background: "#f2545b" }} />
            <div
              className="shrink-0"
              style={{
                height: week.lagos * 0.9,
                background: "#141433",
                borderRadius: "0 0 2px 2px",
              }}
            />
          </div>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-4 text-[11px] text-zinc-500">
        <li className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2 bg-[#141433]" /> Lagos
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2 bg-[#f2545b]" /> Abuja
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2 bg-[#f9c74f]" /> Port Harcourt
        </li>
      </ul>
    </div>
  )
}

export function DeploymentOrbit() {
  return (
    <SceneFrame width={496} height={380}>
      <div className="absolute left-1/2 top-1/2 size-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-zinc-200" />
      <div className="absolute left-1/2 top-1/2 size-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-200" />
      <div className="absolute left-1/2 top-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#f2545b] text-center text-xs font-black leading-tight text-white">
        main
        <br />
        {deploymentOrbit.sha}
      </div>
      <div className={cn(card, "absolute right-[40px] top-[10px] p-2.5 text-xs text-[#141433]")}>
        ✓ {deploymentOrbit.nodes[0]}
      </div>
      <div className={cn(card, "absolute left-[20px] top-[160px] p-2.5 text-xs text-[#141433]")}>
        ↺ {deploymentOrbit.nodes[1]}
      </div>
      <div className={cn(card, "absolute bottom-[20px] right-[70px] p-2.5 text-xs text-[#141433]")}>
        ● {deploymentOrbit.nodes[2]}
      </div>
      <div className="absolute left-[110px] top-[60px] grid size-9 place-items-center rounded-full bg-[#141433] text-xs text-white">
        GH
      </div>
      <div className="absolute bottom-[60px] left-[120px] grid size-9 place-items-center rounded-full bg-[#f9c74f] text-xs font-bold text-[#141433]">
        ₦
      </div>
    </SceneFrame>
  )
}

export function EnvPanel() {
  return (
    <div className={cn(card, "overflow-hidden text-sm")}>
      <div className="flex items-center justify-between border-b border-[#eceef3] px-5 py-3 font-semibold text-[#141433]">
        <span>Environment variables</span>
        <span className="text-xs font-semibold text-[#c04347]">+ Add</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <caption className="sr-only">Example environment variables for a sample project</caption>
          <thead className="text-left text-[11px] text-zinc-500">
            <tr>
              <th className="px-5 py-2 font-medium" scope="col">
                Key
              </th>
              <th className="py-2 font-medium" scope="col">
                Value
              </th>
              <th className="py-2 pr-5 font-medium" scope="col">
                Scope
              </th>
            </tr>
          </thead>
          <tbody className={cn(mono.className, "divide-y divide-[#eceef3] text-xs text-[#141433]")}>
            {exampleEnvVars.map((row) => (
              <tr key={row.key}>
                <td className="px-5 py-2.5">{row.key}</td>
                <td className="py-2.5">{row.value}</td>
                <td className="py-2.5 pr-5 font-sans">{row.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end border-t border-[#eceef3] px-5 py-3">
        <span className="rounded-full bg-[#f2545b] px-4 py-1.5 text-xs font-semibold text-white">Save & redeploy</span>
      </div>
    </div>
  )
}

export function PipelineScene() {
  const steps = [
    {
      mark: "GH",
      markClass: "bg-[#141433] text-white",
      title: "Push received",
      detail: pipelineIllustration.pushRef,
    },
    {
      mark: "▲",
      markClass: "bg-[#f2545b] text-white",
      title: `Built & live on ${DEFAULT_REGION.label}`,
      detail: pipelineIllustration.buildDetail,
    },
    {
      mark: "#",
      markClass: "bg-[#4a154b] text-white",
      title: "Alert sent to Slack",
      detail: pipelineIllustration.slackChannel,
    },
    {
      mark: "₦",
      markClass: "bg-[#0ba4db] text-white",
      title: "Paystack invoice paid",
      detail: `Pro · ${formatNaira(PRO_PLAN.priceNaira)}`,
    },
  ] as const

  const positions = [
    "left-[40px] top-[40px]",
    "left-[90px] top-[115px]",
    "left-[60px] top-[190px]",
    "left-[110px] top-[265px]",
  ]

  return (
    <SceneFrame width={496} height={340}>
      <div className="absolute right-[60px] top-[10px] size-[300px] rounded-full bg-[#fff5d6]" />
      {steps.map((step, index) => (
        <div
          key={step.title}
          className={cn(card, "absolute flex w-[300px] items-center gap-3 p-3 text-xs", positions[index])}
        >
          <span className={cn("grid size-8 shrink-0 place-items-center rounded-[4px] font-semibold", step.markClass)}>
            {step.mark}
          </span>
          <span>
            <span className="block font-bold text-[#141433]">{step.title}</span>
            <span className="text-zinc-500">{step.detail}</span>
          </span>
        </div>
      ))}
    </SceneFrame>
  )
}
