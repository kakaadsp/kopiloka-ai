"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Coffee,
  Package,
  User,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"

interface OrderDetail {
  id: string
  orderNumber: string
  buyerName: string
  buyerPhone: string
  buyerAddress: string
  items: { name: string; quantity: number; price: number; image: string }[]
  subtotal: number
  shippingCost: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  shippingMethod: string
  createdAt: string
  trackingNumber?: string
  notes?: string
}

const mockOrderDetail: OrderDetail = {
  id: "so-1",
  orderNumber: "KPL-2024-001",
  buyerName: "Budi Santoso",
  buyerPhone: "081234567890",
  buyerAddress: "Jl. Merdeka No. 123, RT 01/RW 02, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12130",
  items: [
    {
      name: "Kopi Toraja Premium",
      quantity: 2,
      price: 85000,
      image: "/toraja-coffee.jpg",
    },
    {
      name: "Kopi Gayo Aceh",
      quantity: 1,
      price: 92000,
      image: "/gayo-coffee.jpg",
    },
  ],
  subtotal: 262000,
  shippingCost: 15000,
  total: 277000,
  status: "pending",
  paymentMethod: "Transfer Bank BCA",
  shippingMethod: "JNE Regular",
  createdAt: "2024-01-15T10:30:00",
  notes: "Tolong packing yang rapi ya, untuk kado.",
}

const statusConfig = {
  pending: {
    label: "Menunggu Konfirmasi",
    color: "bg-yellow-500/10 text-yellow-500",
    icon: Clock,
  },
  processing: {
    label: "Sedang Diproses",
    color: "bg-blue-500/10 text-blue-500",
    icon: Package,
  },
  shipped: {
    label: "Dalam Pengiriman",
    color: "bg-purple-500/10 text-purple-500",
    icon: Truck,
  },
  delivered: {
    label: "Selesai",
    color: "bg-green-500/10 text-green-500",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Dibatalkan",
    color: "bg-red-500/10 text-red-500",
    icon: XCircle,
  },
}

export default function SellerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Coffee className="h-8 w-8 animate-pulse text-primary" />
      </div>
    )
  }

  if (!user || user.role !== "seller") {
    router.push("/login")
    return null
  }

  const order = mockOrderDetail
  const StatusIcon = statusConfig[order.status].icon

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/seller/orders"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Pesanan
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{order.orderNumber}</h1>
                <p className="text-muted-foreground mt-1">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Badge className={`${statusConfig[order.status].color} text-sm px-3 py-1`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {statusConfig[order.status].label}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Produk Pesanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <p className="font-semibold text-foreground">
                          Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Buyer Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informasi Pembeli
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nama</p>
                      <p className="font-medium text-foreground">{order.buyerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telepon</p>
                      <p className="font-medium text-foreground">{order.buyerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Alamat Pengiriman</p>
                      <p className="font-medium text-foreground">{order.buyerAddress}</p>
                    </div>
                  </div>
                  {order.notes && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Catatan:</p>
                      <p className="text-foreground">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">Rp {order.subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span className="text-foreground">Rp {order.shippingCost.toLocaleString("id-ID")}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">Rp {order.total.toLocaleString("id-ID")}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment & Shipping */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Pembayaran & Pengiriman</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
                      <p className="font-medium text-foreground">{order.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Metode Pengiriman</p>
                      <p className="font-medium text-foreground">{order.shippingMethod}</p>
                    </div>
                  </div>
                  {order.trackingNumber && (
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Nomor Resi</p>
                      <p className="font-mono font-semibold text-primary">{order.trackingNumber}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              {order.status === "pending" && (
                <Button className="w-full bg-primary hover:bg-primary/90">Proses Pesanan</Button>
              )}
              {order.status === "processing" && (
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Truck className="h-4 w-4 mr-2" />
                  Kirim Pesanan
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
