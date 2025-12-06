"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { getProducts, type Product } from "@/lib/products-data"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  MessageCircle,
  Coffee,
  Package,
  MapPin,
  Store,
} from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const products = getProducts()
    const found = products.find((p) => p.id === params.id)
    setProduct(found || null)
    setLoading(false)
  }, [params.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    toast({
      title: "Berhasil ditambahkan",
      description: `${quantity}x ${product.name} ditambahkan ke keranjang`,
    })
  }

  const handleBuyNow = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    router.push("/cart")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-20">
            <Coffee className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Produk Tidak Ditemukan</h1>
            <p className="text-muted-foreground mb-6">Maaf, produk yang Anda cari tidak tersedia.</p>
            <Button asChild>
              <Link href="/marketplace">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Marketplace
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/marketplace" className="hover:text-foreground transition-colors">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <Image
                src={product.image || "/placeholder.svg?height=600&width=600&query=coffee beans"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                  {product.category}
                </Badge>
                <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                  {product.roastLevel === "light"
                    ? "Light Roast"
                    : product.roastLevel === "medium"
                      ? "Medium Roast"
                      : "Dark Roast"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                {product.origin}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} ulasan)</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <span className="text-muted-foreground">{product.stock} tersedia</span>
              </div>

              <div className="text-3xl font-bold text-primary mb-2">{formatPrice(product.price)}</div>
              <p className="text-muted-foreground">/ {product.weight}g</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-foreground mb-3">Deskripsi</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Seller Info */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{product.sellerName}</p>
                    <p className="text-sm text-muted-foreground">Penjual Terverifikasi</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/chat">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Jumlah</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-l-none"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-muted-foreground">Stok: {product.stock}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Keranjang
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleBuyNow}>
                Beli Sekarang
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Pengiriman Cepat</p>
                  <p className="text-xs text-muted-foreground">1-3 hari kerja</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Kualitas Terjamin</p>
                  <p className="text-xs text-muted-foreground">Fresh roasted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Packaging Aman</p>
                  <p className="text-xs text-muted-foreground">Valve bag</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Coffee className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">100% Asli</p>
                  <p className="text-xs text-muted-foreground">Kopi Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
