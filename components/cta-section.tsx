import Link from "next/link"
import { Bot, Store } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Assistant CTA */}
          <div className="bg-background/10 backdrop-blur rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-background/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-primary-foreground mb-4">Coba AI Assistant Kami</h3>
            <p className="text-primary-foreground/80 mb-6">
              Dapatkan rekomendasi kopi personal, tips brewing, dan informasi lengkap tentang kopi Indonesia dari AI
              yang cerdas dan inklusif.
            </p>
            <Link href="/ai-assistant">
              <Button size="lg" variant="secondary" className="gap-2">
                <Bot className="h-5 w-5" />
                Mulai Chat dengan AI
              </Button>
            </Link>
          </div>

          {/* Seller CTA */}
          <div className="bg-background/10 backdrop-blur rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-background/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-primary-foreground mb-4">Jadi Penjual di KOPILOKA</h3>
            <p className="text-primary-foreground/80 mb-6">
              Jangkau ribuan pecinta kopi Indonesia. Daftarkan toko Anda sekarang dan mulai jual kopi Anda ke seluruh
              Nusantara.
            </p>
            <Link href="/register?role=seller">
              <Button size="lg" variant="secondary" className="gap-2">
                <Store className="h-5 w-5" />
                Daftar Sebagai Penjual
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
