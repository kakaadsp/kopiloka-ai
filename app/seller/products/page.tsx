"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, Coffee, Package, Eye } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { getProducts, deleteProduct as deleteProductFromStorage } from "@/lib/products-data"

interface SellerProduct {
  id: string
  name: string
  price: number
  stock: number
  sold: number
  image: string
  category: string
  status: "active" | "inactive"
}

export default function SellerProductsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user && user.role === "seller") {
      const allProducts = getProducts()
      // Filter products by seller and map to SellerProduct format
      const sellerProducts: SellerProduct[] = allProducts
        .filter((p) => p.sellerId === user.id || p.sellerId === "demo_seller_001" || p.sellerId === "seller_1")
        .map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          stock: p.stock,
          sold: p.reviews || 0, // Using reviews as sold count for demo
          image: p.image,
          category: p.category,
          status: p.stock > 0 ? "active" : ("inactive" as "active" | "inactive"),
        }))

      // If no products found, add some demo products
      if (sellerProducts.length === 0) {
        setProducts([
          {
            id: "sp-1",
            name: "Kopi Toraja Premium",
            price: 85000,
            stock: 50,
            sold: 120,
            image: "/toraja-coffee-beans.jpg",
            category: "Arabika",
            status: "active",
          },
          {
            id: "sp-2",
            name: "Kopi Gayo Aceh",
            price: 92000,
            stock: 35,
            sold: 89,
            image: "/gayo-aceh-coffee.jpg",
            category: "Arabika",
            status: "active",
          },
          {
            id: "sp-3",
            name: "Robusta Lampung",
            price: 65000,
            stock: 0,
            sold: 45,
            image: "/robusta-lampung-coffee.jpg",
            category: "Robusta",
            status: "inactive",
          },
        ])
      } else {
        setProducts(sellerProducts)
      }
    }
  }, [user])

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

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDeleteProduct = (productId: string) => {
    deleteProductFromStorage(productId)
    setProducts(products.filter((p) => p.id !== productId))
    toast({
      title: "Produk dihapus",
      description: "Produk berhasil dihapus dari toko Anda.",
    })
  }

  const toggleProductStatus = (productId: string) => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p)),
    )
    toast({
      title: "Status diubah",
      description: "Status produk berhasil diperbarui.",
    })
  }

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.status === "active").length
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Produk Saya</h1>
              <p className="text-muted-foreground mt-1">Kelola semua produk kopi di toko Anda</p>
            </div>
            <Link href="/seller/products/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                <p className="text-sm text-muted-foreground">Total Produk</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{activeProducts}</p>
                <p className="text-sm text-muted-foreground">Produk Aktif</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-chart-2">{totalSold}</p>
                <p className="text-sm text-muted-foreground">Total Terjual</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {/* Products List */}
          {filteredProducts.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Belum ada produk</h3>
                <p className="text-muted-foreground mb-4">Mulai tambahkan produk kopi Anda untuk dijual</p>
                <Link href="/seller/products/new">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Produk Pertama
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                          <Badge
                            variant={product.status === "active" ? "default" : "secondary"}
                            className={
                              product.status === "active"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {product.status === "active" ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-primary font-semibold">Rp {product.price.toLocaleString("id-ID")}</span>
                          <span className="text-muted-foreground">Stok: {product.stock}</span>
                          <span className="text-muted-foreground">Terjual: {product.sold}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleProductStatus(product.id)}
                          className="border-border"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link href={`/seller/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm" className="border-border bg-transparent">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus "{product.name}"? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-border">Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
