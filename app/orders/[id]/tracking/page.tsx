"use client"

import type React from "react"

import { useParams } from "next/navigation"
import { useOrders } from "@/lib/orders-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle2, ArrowLeft, MapPin, Copy, CheckCheck, Clock, Home } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useState } from "react"

const statusIcons: Record<string, React.ElementType> = {
  "Paket Dikirim": Package,
  "Dalam Perjalanan": Truck,
  "Sedang Diantar": Truck,
  Terkirim: CheckCircle2,
}

export default function TrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const { getOrderById } = useOrders()
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  const order = getOrderById(orderId)

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const copyTrackingNumber = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Login Diperlukan</h2>
            <p className="text-muted-foreground mb-4">Silakan login untuk melacak pengiriman.</p>
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

  if (!order.trackingNumber || !order.trackingEvents) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Belum Ada Info Pengiriman</h2>
            <p className="text-muted-foreground mb-4">
              Pesanan ini belum dikirim atau informasi pengiriman belum tersedia.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href={`/orders/${orderId}`}>Kembali ke Detail Pesanan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const latestEvent = order.trackingEvents[order.trackingEvents.length - 1]
  const isDelivered = order.status === "delivered"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/orders/${orderId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Detail Pesanan
          </Link>

          <h1 className="text-2xl font-bold text-foreground mb-2">Lacak Pengiriman</h1>
          <p className="text-muted-foreground">Pesanan {orderId}</p>
        </div>

        {/* Tracking Info Card */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Kurir</p>
                <p className="font-semibold text-lg">{order.courier}</p>
              </div>
              <Badge className={isDelivered ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                {isDelivered ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Terkirim
                  </>
                ) : (
                  <>
                    <Truck className="w-3 h-3 mr-1" />
                    Dalam Pengiriman
                  </>
                )}
              </Badge>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Nomor Resi</p>
                <p className="font-mono font-semibold">{order.trackingNumber}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={copyTrackingNumber}>
                {copied ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Destination */}
        <Card className="border-border/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="w-4 h-4" />
              Tujuan Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{order.shippingAddress.name}</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
          </CardContent>
        </Card>

        {/* Tracking Timeline */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Riwayat Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

              {/* Events - reversed to show newest first */}
              <div className="space-y-6">
                {[...order.trackingEvents].reverse().map((event, idx) => {
                  const isLatest = idx === 0
                  const IconComponent = statusIcons[event.status] || Package

                  return (
                    <div key={idx} className="relative flex gap-4 pl-10">
                      {/* Icon */}
                      <div
                        className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          isLatest ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className={`font-medium ${isLatest ? "text-primary" : ""}`}>{event.status}</p>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDateTime(event.date)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href="/chat">Hubungi Penjual</Link>
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90" asChild>
            <Link href="/orders">Semua Pesanan</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
