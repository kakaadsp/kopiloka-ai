"use client"

import { useEffect, useState, useMemo } from "react"
import { Search, Filter, X, SlidersHorizontal, Coffee } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProducts, COFFEE_CATEGORIES, COFFEE_ORIGINS, ROAST_LEVELS, type Product } from "@/lib/products-data"

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([])
  const [selectedRoastLevels, setSelectedRoastLevels] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [sortBy, setSortBy] = useState("popular")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    setProducts(getProducts())
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.origin.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category))
    }

    // Origin filter
    if (selectedOrigins.length > 0) {
      filtered = filtered.filter((p) => selectedOrigins.includes(p.origin))
    }

    // Roast level filter
    if (selectedRoastLevels.length > 0) {
      filtered = filtered.filter((p) => selectedRoastLevels.includes(p.roastLevel))
    }

    // Price filter
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default: // popular
        filtered.sort((a, b) => b.reviews - a.reviews)
    }

    return filtered
  }, [products, searchQuery, selectedCategories, selectedOrigins, selectedRoastLevels, priceRange, sortBy])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleOrigin = (origin: string) => {
    setSelectedOrigins((prev) => (prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin]))
  }

  const toggleRoastLevel = (level: string) => {
    setSelectedRoastLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedOrigins([])
    setSelectedRoastLevels([])
    setPriceRange([0, 200000])
    setSearchQuery("")
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedOrigins.length +
    selectedRoastLevels.length +
    (priceRange[0] > 0 || priceRange[1] < 200000 ? 1 : 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Kategori</h3>
        <div className="space-y-2">
          {COFFEE_CATEGORIES.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Origins */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Asal Daerah</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {COFFEE_ORIGINS.map((origin) => (
            <div key={origin} className="flex items-center gap-2">
              <Checkbox
                id={`origin-${origin}`}
                checked={selectedOrigins.includes(origin)}
                onCheckedChange={() => toggleOrigin(origin)}
              />
              <Label htmlFor={`origin-${origin}`} className="text-sm cursor-pointer">
                {origin}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Roast Levels */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Tingkat Roasting</h3>
        <div className="space-y-2">
          {ROAST_LEVELS.map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`roast-${value}`}
                checked={selectedRoastLevels.includes(value)}
                onCheckedChange={() => toggleRoastLevel(value)}
              />
              <Label htmlFor={`roast-${value}`} className="text-sm cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Rentang Harga</h3>
        <div className="px-2">
          <Slider value={priceRange} min={0} max={200000} step={5000} onValueChange={setPriceRange} className="mb-4" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Hapus Filter ({activeFiltersCount})
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Marketplace Kopi</h1>
            <p className="text-muted-foreground">Temukan kopi terbaik dari seluruh Indonesia</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kopi, daerah, atau penjual..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-card">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Terpopuler</SelectItem>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="price-low">Harga Terendah</SelectItem>
                  <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2 bg-card">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                    {activeFiltersCount > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filter Produk</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {selectedOrigins.map((origin) => (
                <Badge
                  key={origin}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => toggleOrigin(origin)}
                >
                  {origin}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {selectedRoastLevels.map((level) => (
                <Badge
                  key={level}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => toggleRoastLevel(level)}
                >
                  {ROAST_LEVELS.find((r) => r.value === level)?.label}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop Sidebar Filter */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Filter</h2>
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground text-sm">Menampilkan {filteredProducts.length} produk</p>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Coffee className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Tidak ada produk ditemukan</h3>
                  <p className="text-muted-foreground mb-4">Coba ubah filter atau kata kunci pencarian Anda</p>
                  <Button variant="outline" onClick={clearFilters} className="bg-transparent">
                    Hapus Semua Filter
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
