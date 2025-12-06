"use client"

import { useParams } from "next/navigation"
import { useOrders } from "@/lib/orders-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard,
  Calendar,
  Copy,
  CheckCheck,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useState } from "react"

const statusConfig = {
  pending: { label: "Menunggu Pembayaran", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Diproses", icon: Package, color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Dalam Pengiriman", icon: Truck, color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Selesai", icon: CheckCircle2, color: "bg-green-100 text-green-800" },
  cancelled: { label: "Dibatalkan", icon: XCircle, color: "bg-red-100 text-red-800" },
}

const paymentMethodLabels: Record<string, string> = {
  transfer: "Transfer Bank",
  ewallet: "E-Wallet",
  cod: "Bayar di Tempat (COD)",
}

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string
  const { getOrderById } = useOrders()
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  const order = getOrderById(orderId)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Login Diperlukan</h2>
            <p className="text-muted-foreground mb-4">Silakan login untuk melihat detail pesanan.</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/login">Login Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Pesanan Tidak Ditemukan</h2>
            <p className="text-muted-foreground mb-4">Pesanan dengan ID {orderId} tidak ditemukan.</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/orders">Kembali ke Pesanan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const status = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = status.icon

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Pesanan
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{order.id}</h1>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyOrderId}>
                  {copied ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge className={`${status.color} text-sm px-3 py-1`}>
              <StatusIcon className="w-4 h-4 mr-1" />
              {status.label}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Products */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Produk Dipesan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.productImage || "/placeholder.svg"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.seller}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Alamat Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{order.shippingAddress.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Button for shipped orders */}
            {(order.status === "shipped" || order.status === "delivered") && order.trackingNumber && (
              <Card className="border-border/50 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nomor Resi</p>
                      <p className="font-mono font-semibold">{order.trackingNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.courier}</p>
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link href={`/orders/${order.id}/tracking`}>
                        <Truck className="w-4 h-4 mr-2" />
                        Lacak Pengiriman
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal Produk</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ongkos Kirim</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(order.grandTotal)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Metode Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{paymentMethodLabels[order.paymentMethod] || order.paymentMethod}</p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              {order.status === "delivered" && (
                <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                  <Link href="/marketplace">Beli Lagi</Link>
                </Button>
              )}
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/chat">Hubungi Penjual</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
