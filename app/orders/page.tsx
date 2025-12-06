"use client"

import { useAuth } from "@/lib/auth-context"
import { useOrders } from "@/lib/orders-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Clock, Truck, CheckCircle2, XCircle, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const statusConfig = {
  pending: { label: "Menunggu Pembayaran", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Diproses", icon: Package, color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Dalam Pengiriman", icon: Truck, color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Selesai", icon: CheckCircle2, color: "bg-green-100 text-green-800" },
  cancelled: { label: "Dibatalkan", icon: XCircle, color: "bg-red-100 text-red-800" },
}

export default function OrdersPage() {
  const { user } = useAuth()
  const { getOrdersByUser } = useOrders()

  const userOrders = user ? getOrdersByUser(user.id) : []

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
    }).format(date)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Login untuk Melihat Pesanan</h2>
            <p className="text-muted-foreground mb-4">Silakan login terlebih dahulu untuk melihat riwayat pesanan.</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/login">Login Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-6 h-6" />
            Pesanan Saya
          </h1>
          <p className="text-muted-foreground">Riwayat dan status pesanan Anda ({userOrders.length} pesanan)</p>
        </div>

        {userOrders.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Belum Ada Pesanan</h2>
              <p className="text-muted-foreground mb-6">Anda belum memiliki pesanan. Yuk mulai belanja!</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/marketplace">Jelajahi Marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig]
              const StatusIcon = status.icon
              return (
                <Card key={order.id} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-base">{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                      <Badge className={status.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.productImage || "/placeholder.svg"}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">{item.seller}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} x {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">Total Pesanan</span>
                      <span className="font-semibold text-primary">{formatPrice(order.grandTotal)}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                        <Link href={`/orders/${order.id}`}>Detail Pesanan</Link>
                      </Button>
                      {order.status === "delivered" && (
                        <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" asChild>
                          <Link href="/marketplace">Beli Lagi</Link>
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" asChild>
                          <Link href={`/orders/${order.id}/tracking`}>
                            <Truck className="w-4 h-4 mr-1" />
                            Lacak Pengiriman
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
