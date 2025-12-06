"use client"

import Link from "next/link"
import { ArrowRight, Bot, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Bot className="h-4 w-4" />
            <span>Didukung AI untuk Pengalaman Terbaik</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Temukan Kopi Terbaik
            <br />
            <span className="text-primary">Indonesia</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Platform AI-powered yang menghubungkan petani kopi, penjual, dan pecinta kopi. Jelajahi kopi dari Aceh
            hingga Papua dengan rekomendasi personal dari AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/marketplace">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <ShoppingBag className="h-5 w-5" />
                Jelajahi Marketplace
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/ai-assistant">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Bot className="h-5 w-5" />
                Coba AI Assistant
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Produk Kopi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Penjual Terpercaya</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">34</div>
              <div className="text-sm text-muted-foreground">Provinsi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Pecinta Kopi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
