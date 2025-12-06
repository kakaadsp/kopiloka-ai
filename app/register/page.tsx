"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Coffee, Eye, EyeOff, Loader2, Store, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register, isLoading } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<UserRole>("buyer")
  const [showPassword, setShowPassword] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    storeName: "",
    storeDescription: "",
  })

  useEffect(() => {
    const role = searchParams.get("role")
    if (role === "seller") {
      setActiveTab("seller")
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Mohon isi semua field yang wajib",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak cocok",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "seller" && !formData.storeName) {
      toast({
        title: "Error",
        description: "Nama toko wajib diisi untuk penjual",
        variant: "destructive",
      })
      return
    }

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: activeTab,
      phone: formData.phone,
      address: formData.address,
      storeName: activeTab === "seller" ? formData.storeName : undefined,
      storeDescription: activeTab === "seller" ? formData.storeDescription : undefined,
    })

    if (success) {
      toast({
        title: "Berhasil mendaftar",
        description: `Selamat datang di KOPILOKA sebagai ${activeTab === "buyer" ? "pembeli" : "penjual"}!`,
      })
      router.push("/dashboard")
    } else {
      toast({
        title: "Gagal mendaftar",
        description: "Email sudah terdaftar. Silakan gunakan email lain.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Coffee className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold text-foreground">KOPILOKA</span>
        </Link>

        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Daftar Akun</CardTitle>
            <CardDescription>Bergabung dengan komunitas kopi Indonesia</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserRole)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="buyer" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Pembeli
                </TabsTrigger>
                <TabsTrigger value="seller" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Penjual
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Common fields */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 karakter"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-background pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Ulangi password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Alamat lengkap"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-background resize-none"
                    rows={2}
                  />
                </div>

                {/* Seller specific fields */}
                <TabsContent value="seller" className="space-y-4 mt-0">
                  <div className="border-t border-border pt-4">
                    <h3 className="font-medium text-foreground mb-4">Informasi Toko</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="storeName">Nama Toko *</Label>
                        <Input
                          id="storeName"
                          name="storeName"
                          placeholder="Nama toko kopi Anda"
                          value={formData.storeName}
                          onChange={handleChange}
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="storeDescription">Deskripsi Toko</Label>
                        <Textarea
                          id="storeDescription"
                          name="storeDescription"
                          placeholder="Ceritakan tentang toko dan kopi Anda..."
                          value={formData.storeDescription}
                          onChange={handleChange}
                          className="bg-background resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    `Daftar sebagai ${activeTab === "buyer" ? "Pembeli" : "Penjual"}`
                  )}
                </Button>
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Masuk di sini
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
