"use client"

import { Button } from "@/components/ui/button"
import { HeroScene } from "./hero-scene"
import { ArrowRight, Github } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-16">
      {/* 3D Background */}
      <HeroScene />

      {/* Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Now accepting Naira payments
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Deploy Your Apps
            <br />
            <span className="text-primary">The African Way</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Push your code. We handle the rest. The fastest cloud platform built for Nigerian and African developers. No dollar hassles, just pure deployment magic.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90">
              Start Deploying Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-border bg-transparent hover:bg-muted">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Trusted by developers across Africa</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <span className="text-lg font-semibold text-foreground">Flutterwave</span>
              <span className="text-lg font-semibold text-foreground">Paystack</span>
              <span className="text-lg font-semibold text-foreground">Andela</span>
              <span className="text-lg font-semibold text-foreground">Cowrywise</span>
              <span className="text-lg font-semibold text-foreground">Piggyvest</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Scroll to explore</span>
            <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 p-1">
              <div className="h-2 w-full animate-bounce rounded-full bg-primary"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
