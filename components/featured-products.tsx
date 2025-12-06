"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { getProducts, type Product } from "@/lib/products-data"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const allProducts = getProducts()
    // Get top rated products
    const featured = allProducts.sort((a, b) => b.rating - a.rating).slice(0, 4)
    setProducts(featured)
  }, [])

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Kopi Pilihan</h2>
            <p className="text-muted-foreground">Kopi terbaik dengan rating tertinggi dari penjual terpercaya</p>
          </div>
          <Link href="/marketplace">
            <Button variant="outline" className="hidden sm:flex gap-2 bg-transparent">
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/marketplace">
            <Button variant="outline" className="gap-2 bg-transparent">
              Lihat Semua Produk
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
