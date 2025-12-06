"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ShoppingBag,
  Package,
  MessageCircle,
  Store,
  TrendingUp,
  Users,
  Coffee,
  ArrowRight,
  Plus,
  Bot,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/orders-context"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { orders, getOrdersByUser } = useOrders()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Coffee className="h-8 w-8 animate-pulse text-primary" />
      </div>
    )
  }

  const userOrders = getOrdersByUser(user.id)
  const orderCount = userOrders.length

  const buyerQuickActions = [
    {
      title: "Jelajahi Kopi",
      description: "Temukan kopi terbaik dari seluruh Indonesia",
      icon: ShoppingBag,
      href: "/marketplace",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "AI Assistant",
      description: "Dapatkan rekomendasi kopi personal",
      icon: Bot,
      href: "/ai-assistant",
      color: "bg-chart-2/10 text-chart-2",
    },
    {
      title: "Pesanan Saya",
      description: "Lihat status pesanan Anda",
      icon: Package,
      href: "/orders",
      color: "bg-chart-3/10 text-chart-3",
    },
    {
      title: "Chat",
      description: "Pesan dengan penjual",
      icon: MessageCircle,
      href: "/chat",
      color: "bg-chart-4/10 text-chart-4",
    },
  ]

  const sellerQuickActions = [
    {
      title: "Produk Saya",
      description: "Kelola produk kopi Anda",
      icon: Store,
      href: "/seller/products",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Tambah Produk",
      description: "Upload produk kopi baru",
      icon: Plus,
      href: "/seller/products/new",
      color: "bg-chart-2/10 text-chart-2",
    },
    {
      title: "Pesanan Masuk",
      description: "Lihat dan proses pesanan",
      icon: Package,
      href: "/seller/orders",
      color: "bg-chart-3/10 text-chart-3",
    },
    {
      title: "Chat Pembeli",
      description: "Balas pesan dari pembeli",
      icon: MessageCircle,
      href: "/chat",
      color: "bg-chart-4/10 text-chart-4",
    },
  ]

  const quickActions = user.role === "seller" ? sellerQuickActions : buyerQuickActions

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Selamat datang, {user.name}!</h1>
            <p className="text-muted-foreground">
              {user.role === "seller"
                ? `Kelola toko "${user.storeName}" Anda dari dashboard ini.`
                : "Temukan kopi terbaik Indonesia dari dashboard ini."}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {user.role === "seller" ? (
              <>
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">0</p>
                        <p className="text-xs text-muted-foreground">Produk Aktif</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-chart-2/10 rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-chart-2" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">0</p>
                        <p className="text-xs text-muted-foreground">Pesanan Baru</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-chart-3/10 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-chart-3" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">Rp 0</p>
                        <p className="text-xs text-muted-foreground">Penjualan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-chart-4/10 rounded-lg">
                        <Users className="h-5 w-5 text-chart-4" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">0</p>
                        <p className="text-xs text-muted-foreground">Pelanggan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{orderCount}</p>
                        <p className="text-xs text-muted-foreground">Pesanan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-chart-2/10 rounded-lg">
                        <Coffee className="h-5 w-5 text-chart-2" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{orderCount}</p>
                        <p className="text-xs text-muted-foreground">Kopi Dicoba</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-chart-3/10 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-chart-3" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">0</p>
                        <p className="text-xs text-muted-foreground">Pesan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Link href="/ai-assistant">
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-chart-4/10 rounded-lg">
                          <Bot className="h-5 w-5 text-chart-4" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">AI</p>
                          <p className="text-xs text-muted-foreground">Assistant</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors h-full cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg mb-1">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                      <div className="mt-3 flex items-center text-primary text-sm font-medium">
                        Buka <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Profil Anda</CardTitle>
              <CardDescription>Informasi akun Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p className="font-medium text-foreground">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipe Akun</p>
                  <p className="font-medium text-foreground capitalize">
                    {user.role === "buyer" ? "Pembeli" : "Penjual"}
                  </p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telepon</p>
                    <p className="font-medium text-foreground">{user.phone}</p>
                  </div>
                )}
                {user.storeName && (
                  <div>
                    <p className="text-sm text-muted-foreground">Nama Toko</p>
                    <p className="font-medium text-foreground">{user.storeName}</p>
                  </div>
                )}
                {user.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Alamat</p>
                    <p className="font-medium text-foreground">{user.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
