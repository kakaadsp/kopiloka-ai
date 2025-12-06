"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Coffee, Package, Search, Eye, CheckCircle, Truck, Clock, XCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface SellerOrder {
  id: string
  orderNumber: string
  buyerName: string
  buyerAddress: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  trackingNumber?: string
}

const initialOrders: SellerOrder[] = [
  {
    id: "so-1",
    orderNumber: "KPL-2024-001",
    buyerName: "Budi Santoso",
    buyerAddress: "Jl. Merdeka No. 123, Jakarta Selatan",
    items: [
      { name: "Kopi Toraja Premium", quantity: 2, price: 85000 },
      { name: "Kopi Gayo Aceh", quantity: 1, price: 92000 },
    ],
    total: 262000,
    status: "pending",
    createdAt: "2024-01-15T10:30:00",
  },
  {
    id: "so-2",
    orderNumber: "KPL-2024-002",
    buyerName: "Siti Rahayu",
    buyerAddress: "Jl. Sudirman No. 456, Bandung",
    items: [{ name: "Robusta Lampung", quantity: 3, price: 65000 }],
    total: 195000,
    status: "processing",
    createdAt: "2024-01-14T14:20:00",
  },
  {
    id: "so-3",
    orderNumber: "KPL-2024-003",
    buyerName: "Ahmad Wijaya",
    buyerAddress: "Jl. Diponegoro No. 789, Surabaya",
    items: [{ name: "Kopi Toraja Premium", quantity: 1, price: 85000 }],
    total: 85000,
    status: "shipped",
    createdAt: "2024-01-13T09:15:00",
    trackingNumber: "JNE123456789",
  },
  {
    id: "so-4",
    orderNumber: "KPL-2024-004",
    buyerName: "Dewi Lestari",
    buyerAddress: "Jl. Gatot Subroto No. 321, Yogyakarta",
    items: [
      { name: "Kopi Gayo Aceh", quantity: 2, price: 92000 },
      { name: "Kopi Toraja Premium", quantity: 1, price: 85000 },
    ],
    total: 269000,
    status: "delivered",
    createdAt: "2024-01-10T16:45:00",
    trackingNumber: "JNE987654321",
  },
]

const statusConfig = {
  pending: {
    label: "Menunggu",
    color: "bg-yellow-500/10 text-yellow-500",
    icon: Clock,
  },
  processing: {
    label: "Diproses",
    color: "bg-blue-500/10 text-blue-500",
    icon: Package,
  },
  shipped: {
    label: "Dikirim",
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

export default function SellerOrdersPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<SellerOrder[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null)
  const [showShipDialog, setShowShipDialog] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleProcessOrder = (orderId: string) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: "processing" as const } : o)))
    toast({
      title: "Pesanan diproses",
      description: "Status pesanan berhasil diubah menjadi diproses.",
    })
  }

  const handleShipOrder = () => {
    if (!selectedOrder || !trackingNumber.trim()) {
      toast({
        title: "Error",
        description: "Mohon masukkan nomor resi pengiriman.",
        variant: "destructive",
      })
      return
    }

    setOrders(
      orders.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: "shipped" as const, trackingNumber: trackingNumber } : o,
      ),
    )
    setShowShipDialog(false)
    setTrackingNumber("")
    setSelectedOrder(null)
    toast({
      title: "Pesanan dikirim",
      description: "Status pesanan berhasil diubah menjadi dikirim.",
    })
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length
  const processingCount = orders.filter((o) => o.status === "processing").length
  const shippedCount = orders.filter((o) => o.status === "shipped").length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Pesanan Masuk</h1>
            <p className="text-muted-foreground mt-1">Kelola dan proses pesanan dari pembeli</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Menunggu</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-500">{processingCount}</p>
                <p className="text-sm text-muted-foreground">Diproses</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-500">{shippedCount}</p>
                <p className="text-sm text-muted-foreground">Dikirim</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nomor pesanan atau nama pembeli..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="processing">Diproses</SelectItem>
                <SelectItem value="shipped">Dikirim</SelectItem>
                <SelectItem value="delivered">Selesai</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Belum ada pesanan</h3>
                <p className="text-muted-foreground">Pesanan dari pembeli akan muncul di sini</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon
                return (
                  <Card key={order.id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{order.orderNumber}</h3>
                            <Badge className={statusConfig[order.status].color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[order.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">{order.buyerName}</span> -{" "}
                            {order.buyerAddress}
                          </p>
                          <div className="text-sm text-muted-foreground mb-2">
                            {order.items.map((item, i) => (
                              <span key={i}>
                                {item.name} x{item.quantity}
                                {i < order.items.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-primary font-semibold">Rp {order.total.toLocaleString("id-ID")}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {order.trackingNumber && (
                            <p className="text-xs text-muted-foreground mt-1">Resi: {order.trackingNumber}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleProcessOrder(order.id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              Proses Pesanan
                            </Button>
                          )}
                          {order.status === "processing" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowShipDialog(true)
                              }}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Kirim
                            </Button>
                          )}
                          <Link href={`/seller/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="border-border bg-transparent">
                              <Eye className="h-4 w-4 mr-2" />
                              Detail
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Ship Dialog */}
      <Dialog open={showShipDialog} onOpenChange={setShowShipDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Kirim Pesanan</DialogTitle>
            <DialogDescription>
              Masukkan nomor resi pengiriman untuk pesanan {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="tracking">Nomor Resi</Label>
            <Input
              id="tracking"
              placeholder="Contoh: JNE123456789"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="mt-2 bg-background border-border"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShipDialog(false)} className="border-border">
              Batal
            </Button>
            <Button onClick={handleShipOrder} className="bg-primary hover:bg-primary/90">
              Konfirmasi Pengiriman
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
