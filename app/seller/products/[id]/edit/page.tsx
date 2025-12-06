"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Coffee, Upload, Save } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  getProducts,
  updateProduct,
  COFFEE_CATEGORIES,
  COFFEE_ORIGINS,
  ROAST_LEVELS,
  type Product,
} from "@/lib/products-data"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    origin: "",
    roastLevel: "medium" as "light" | "medium" | "dark",
    weight: "",
    image: "",
  })

  useEffect(() => {
    if (!authLoading && user) {
      const products = getProducts()
      const found = products.find((p) => p.id === productId)
      if (found) {
        setProduct(found)
        setFormData({
          name: found.name,
          description: found.description,
          price: found.price.toString(),
          stock: found.stock.toString(),
          category: found.category,
          origin: found.origin,
          roastLevel: found.roastLevel,
          weight: found.weight.toString(),
          image: found.image,
        })
      }
      setIsLoading(false)
    }
  }, [authLoading, user, productId])

  if (authLoading || isLoading) {
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

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-2xl mx-auto px-4 text-center py-12">
            <Coffee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Produk Tidak Ditemukan</h1>
            <p className="text-muted-foreground mb-4">Produk yang Anda cari tidak tersedia.</p>
            <Link href="/seller/products">
              <Button className="bg-primary hover:bg-primary/90">Kembali ke Produk Saya</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const updated = updateProduct(productId, {
        name: formData.name,
        description: formData.description,
        price: Number.parseInt(formData.price),
        stock: Number.parseInt(formData.stock),
        category: formData.category,
        origin: formData.origin,
        roastLevel: formData.roastLevel,
        weight: Number.parseInt(formData.weight),
        image: formData.image || "/pile-of-coffee-beans.png",
      })

      if (updated) {
        toast({
          title: "Produk diperbarui",
          description: "Perubahan pada produk berhasil disimpan.",
        })
        setTimeout(() => {
          router.push("/seller/products")
        }, 1000)
      }
    } catch (error) {
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan perubahan.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster />
      <main className="pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/seller/products"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Produk Saya
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Edit Produk</h1>
            <p className="text-muted-foreground mt-1">Perbarui informasi produk kopi Anda</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">
                    Nama Produk *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Kopi Arabika Aceh Gayo Premium"
                    className="mt-1 bg-background border-border"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground">
                    Deskripsi Produk *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Jelaskan karakteristik kopi Anda..."
                    className="mt-1 bg-background border-border min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-foreground">
                      Harga (Rp) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="85000"
                      className="mt-1 bg-background border-border"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock" className="text-foreground">
                      Stok *
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="50"
                      className="mt-1 bg-background border-border"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="weight" className="text-foreground">
                    Berat (gram) *
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="250"
                    className="mt-1 bg-background border-border"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Detail Kopi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-foreground">
                    Kategori *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="mt-1 bg-background border-border">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {COFFEE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="origin" className="text-foreground">
                    Asal Daerah *
                  </Label>
                  <Select
                    value={formData.origin}
                    onValueChange={(value) => setFormData({ ...formData, origin: value })}
                  >
                    <SelectTrigger className="mt-1 bg-background border-border">
                      <SelectValue placeholder="Pilih asal daerah" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {COFFEE_ORIGINS.map((origin) => (
                        <SelectItem key={origin} value={origin}>
                          {origin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="roastLevel" className="text-foreground">
                    Tingkat Roasting *
                  </Label>
                  <Select
                    value={formData.roastLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, roastLevel: value as "light" | "medium" | "dark" })
                    }
                  >
                    <SelectTrigger className="mt-1 bg-background border-border">
                      <SelectValue placeholder="Pilih tingkat roasting" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {ROAST_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Foto Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  {formData.image ? (
                    <div className="space-y-4">
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({ ...formData, image: "" })}
                        className="border-border"
                      >
                        Hapus Foto
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Klik untuk upload atau drag & drop</p>
                      <p className="text-muted-foreground text-xs mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
                <Input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Atau masukkan URL gambar..."
                  className="mt-4 bg-background border-border"
                />
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Link href="/seller/products" className="flex-1">
                <Button type="button" variant="outline" className="w-full border-border bg-transparent">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={isSaving} className="flex-1 bg-primary hover:bg-primary/90">
                {isSaving ? (
                  <>
                    <Coffee className="h-4 w-4 mr-2 animate-pulse" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
