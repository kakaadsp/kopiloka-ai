"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Coffee, Eye, EyeOff, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Mohon isi semua field")
      toast({
        title: "Error",
        description: "Mohon isi semua field",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Attempting login with:", email)
    const success = await login(email, password)
    console.log("[v0] Login result:", success)

    if (success) {
      toast({
        title: "Berhasil masuk",
        description: "Selamat datang kembali di KOPILOKA!",
      })
      router.push("/dashboard")
    } else {
      setError("Email atau password salah. Gunakan akun demo atau daftar akun baru.")
      toast({
        title: "Gagal masuk",
        description: "Email atau password salah. Silakan daftar jika belum punya akun.",
        variant: "destructive",
      })
    }
  }

  const fillDemoCredentials = (type: "buyer" | "seller") => {
    if (type === "buyer") {
      setEmail("buyer@kopiloka.id")
      setPassword("demo123")
    } else {
      setEmail("seller@kopiloka.id")
      setPassword("demo123")
    }
    setError("")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Coffee className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold text-foreground">KOPILOKA</span>
        </Link>

        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Masuk</CardTitle>
            <CardDescription>Masuk ke akun KOPILOKA Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  "Masuk"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Daftar sekarang
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 p-4 bg-card border border-border rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Info className="h-4 w-4 text-primary" />
            Akun Demo untuk Testing
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => fillDemoCredentials("buyer")} className="w-full">
              Isi Akun Buyer
            </Button>
            <Button variant="outline" size="sm" onClick={() => fillDemoCredentials("seller")} className="w-full">
              Isi Akun Seller
            </Button>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <span className="font-medium">Buyer:</span> buyer@kopiloka.id / demo123
            </p>
            <p>
              <span className="font-medium">Seller:</span> seller@kopiloka.id / demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
