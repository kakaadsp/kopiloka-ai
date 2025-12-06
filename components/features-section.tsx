import { Bot, ShoppingBag, MessageCircle, Shield, Truck, Leaf } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Bot,
    title: "AI Assistant Inklusif",
    description:
      "Dapatkan rekomendasi kopi personal, tips brewing, dan informasi lengkap dari AI yang memahami kopi Indonesia.",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace Terlengkap",
    description: "Temukan berbagai jenis kopi dari seluruh Nusantara, dari Arabika Gayo hingga Robusta Lampung.",
  },
  {
    icon: MessageCircle,
    title: "Chat Langsung",
    description: "Berkomunikasi langsung dengan penjual untuk diskusi produk, negosiasi, atau konsultasi kopi.",
  },
  {
    icon: Shield,
    title: "Transaksi Aman",
    description: "Pembayaran aman dengan perlindungan pembeli. Dana diteruskan ke penjual setelah konfirmasi.",
  },
  {
    icon: Truck,
    title: "Pengiriman Cepat",
    description: "Kopi segar dikirim langsung dari penjual ke rumah Anda dengan packaging khusus.",
  },
  {
    icon: Leaf,
    title: "Dukung Petani Lokal",
    description: "Setiap pembelian mendukung langsung petani dan usaha kopi lokal Indonesia.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Mengapa KOPILOKA?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Platform inovatif yang menggabungkan teknologi AI dengan kearifan lokal untuk menghadirkan pengalaman kopi
            terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
