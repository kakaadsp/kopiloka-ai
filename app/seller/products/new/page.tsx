"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, Coffee, X, ImageIcon } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { addProduct, COFFEE_CATEGORIES, COFFEE_ORIGINS, ROAST_LEVELS } from "@/lib/products-data"

export default function NewProductPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    origin: "",
    roastLevel: "",
    weight: "",
  })

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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "File tidak valid",
          description: "Mohon pilih file gambar (JPG, PNG, dll.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Ukuran file maksimal 5MB.",
          variant: "destructive",
        })
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCancel = () => {
    // Confirm if form has data
    if (formData.name || formData.description || formData.price || imagePreview) {
      if (confirm("Anda yakin ingin membatalkan? Data yang diisi akan hilang.")) {
        router.push("/seller/products")
      }
    } else {
      router.push("/seller/products")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon isi nama produk, harga, stok, dan kategori.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate price and stock are positive numbers
    if (Number(formData.price) <= 0 || Number(formData.stock) <= 0) {
      toast({
        title: "Data tidak valid",
        description: "Harga dan stok harus lebih dari 0.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Add product to storage
      const newProduct = addProduct({
        name: formData.name,
        description: formData.description || "Kopi berkualitas dari KOPILOKA",
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        origin: formData.origin || "Indonesia",
        roastLevel: (formData.roastLevel as "light" | "medium" | "dark") || "medium",
        weight: Number(formData.weight) || 250,
        image: imagePreview || "/coffee-beans-product.jpg",
        sellerId: user.id,
        sellerName: user.name,
      })

      toast({
        title: "Produk berhasil ditambahkan!",
        description: `"${newProduct.name}" sudah ditambahkan ke toko Anda.`,
      })

      // Redirect after short delay
      setTimeout(() => {
        router.push("/seller/products")
      }, 1000)
    } catch (error) {
      toast({
        title: "Gagal menambahkan produk",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster />
      <main className="pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/seller/products"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Produk
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Tambah Produk Baru</h1>
            <p className="text-muted-foreground mt-1">Isi informasi produk kopi yang ingin Anda jual</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
                <CardDescription>Detail utama produk Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Produk *</Label>
                  <Input
                    id="name"
                    placeholder="Contoh: Kopi Toraja Premium"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="mt-1 bg-background border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Deskripsikan produk kopi Anda, seperti rasa, aroma, dan cara terbaik menyeduhnya..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="mt-1 bg-background border-border min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Harga (Rp) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="85000"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className="mt-1 bg-background border-border"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stok *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="50"
                      value={formData.stock}
                      onChange={(e) => handleChange("stock", e.target.value)}
                      className="mt-1 bg-background border-border"
                      min="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Detail Produk</CardTitle>
                <CardDescription>Spesifikasi kopi Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Kategori *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger className="mt-1 bg-background border-border">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {COFFEE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="origin">Asal Daerah</Label>
                    <Select value={formData.origin} onValueChange={(value) => handleChange("origin", value)}>
                      <SelectTrigger className="mt-1 bg-background border-border">
                        <SelectValue placeholder="Pilih daerah" />
                      </SelectTrigger>
                      <SelectContent>
                        {COFFEE_ORIGINS.map((origin) => (
                          <SelectItem key={origin} value={origin}>
                            {origin}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roastLevel">Tingkat Roasting</Label>
                    <Select value={formData.roastLevel} onValueChange={(value) => handleChange("roastLevel", value)}>
                      <SelectTrigger className="mt-1 bg-background border-border">
                        <SelectValue placeholder="Pilih roasting" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROAST_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="weight">Berat (gram)</Label>
                    <Select value={formData.weight} onValueChange={(value) => handleChange("weight", value)}>
                      <SelectTrigger className="mt-1 bg-background border-border">
                        <SelectValue placeholder="Pilih berat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 gram</SelectItem>
                        <SelectItem value="250">250 gram</SelectItem>
                        <SelectItem value="500">500 gram</SelectItem>
                        <SelectItem value="1000">1 kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Foto Produk</CardTitle>
                <CardDescription>Upload foto kopi Anda (maks. 5MB, format JPG/PNG)</CardDescription>
              </CardHeader>
              <CardContent>
                {imagePreview ? (
                  // Show image preview
                  <div className="relative">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview produk"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Klik tombol X untuk menghapus dan memilih foto lain
                    </p>
                  </div>
                ) : (
                  // Show upload area
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <ImageIcon className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-foreground font-medium mb-1">Klik untuk upload foto</p>
                      <p className="text-muted-foreground text-sm mb-4">atau drag & drop file di sini</p>
                      <Button type="button" variant="outline" className="border-border bg-transparent">
                        <Upload className="h-4 w-4 mr-2" />
                        Pilih Foto
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-4">
              <Button type="button" variant="outline" className="border-border bg-transparent" onClick={handleCancel}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? (
                  <>
                    <Coffee className="h-4 w-4 mr-2 animate-pulse" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Produk"
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
