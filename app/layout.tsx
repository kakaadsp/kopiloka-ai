import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { ChatProvider } from "@/lib/chat-context"
import { OrdersProvider } from "@/lib/orders-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KOPILOKA - Marketplace Kopi Indonesia",
  description:
    "Platform AI-powered untuk menghubungkan petani kopi, penjual, dan pecinta kopi Indonesia. Temukan kopi terbaik dari seluruh Nusantara.",
  keywords: ["kopi", "coffee", "marketplace", "indonesia", "petani kopi", "AI"],
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              <ChatProvider>
                {children}
                <Toaster />
              </ChatProvider>
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
