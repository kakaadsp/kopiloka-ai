export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  origin: string
  roastLevel: "light" | "medium" | "dark"
  weight: number // in grams
  stock: number
  sellerId: string
  sellerName: string
  rating: number
  reviews: number
  createdAt: Date
}

export const COFFEE_CATEGORIES = ["Arabika", "Robusta", "Liberika", "Excelsa", "Specialty", "Blend"]

export const COFFEE_ORIGINS = [
  "Aceh Gayo",
  "Toraja",
  "Flores",
  "Java",
  "Bali Kintamani",
  "Papua Wamena",
  "Lampung",
  "Bengkulu",
  "Sulawesi",
  "Sumatra Mandheling",
]

export const ROAST_LEVELS = [
  { value: "light", label: "Light Roast" },
  { value: "medium", label: "Medium Roast" },
  { value: "dark", label: "Dark Roast" },
]

// Sample products data
export const initialProducts: Product[] = [
  {
    id: "prod_1",
    name: "Kopi Arabika Aceh Gayo Premium",
    description:
      "Kopi Arabika single origin dari dataran tinggi Gayo, Aceh. Memiliki cita rasa fruity dengan aroma floral yang khas. Proses natural yang menghasilkan body penuh dengan aftertaste manis.",
    price: 85000,
    image: "/arabica-coffee-beans-aceh-gayo-premium.jpg",
    category: "Arabika",
    origin: "Aceh Gayo",
    roastLevel: "medium",
    weight: 250,
    stock: 50,
    sellerId: "seller_1",
    sellerName: "Kopi Gayo Sejahtera",
    rating: 4.8,
    reviews: 124,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "prod_2",
    name: "Toraja Sapan Premium",
    description:
      "Kopi specialty dari Toraja dengan karakteristik earthy dan spicy. Proses wet-hulled tradisional menghasilkan body yang tebal dengan keasaman rendah.",
    price: 95000,
    image: "/toraja-coffee-beans-premium-dark.jpg",
    category: "Specialty",
    origin: "Toraja",
    roastLevel: "dark",
    weight: 250,
    stock: 30,
    sellerId: "seller_2",
    sellerName: "Warung Kopi Toraja",
    rating: 4.9,
    reviews: 89,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "prod_3",
    name: "Robusta Lampung Gold",
    description:
      "Robusta pilihan dari Lampung dengan kadar kafein tinggi. Cocok untuk pecinta kopi dengan karakter bold dan pahit yang kuat.",
    price: 55000,
    image: "/robusta-coffee-beans-lampung.jpg",
    category: "Robusta",
    origin: "Lampung",
    roastLevel: "dark",
    weight: 500,
    stock: 100,
    sellerId: "seller_3",
    sellerName: "Petani Kopi Lampung",
    rating: 4.5,
    reviews: 256,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "prod_4",
    name: "Bali Kintamani Honey Process",
    description:
      "Kopi Arabika dari Kintamani, Bali dengan proses honey yang menghasilkan rasa manis alami. Notes citrus dan chocolate dengan body medium.",
    price: 110000,
    image: "/bali-kintamani-coffee-beans-honey-process.jpg",
    category: "Arabika",
    origin: "Bali Kintamani",
    roastLevel: "light",
    weight: 200,
    stock: 25,
    sellerId: "seller_4",
    sellerName: "Kopi Bali Authentic",
    rating: 4.7,
    reviews: 67,
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "prod_5",
    name: "Papua Wamena Wild Coffee",
    description:
      "Kopi eksotis dari pegunungan Papua. Ditanam secara organik oleh petani lokal dengan metode tradisional. Rasa unik dengan notes herbal dan earthy.",
    price: 125000,
    image: "/papua-wamena-wild-coffee-organic.jpg",
    category: "Specialty",
    origin: "Papua Wamena",
    roastLevel: "medium",
    weight: 200,
    stock: 15,
    sellerId: "seller_5",
    sellerName: "Papua Coffee Collective",
    rating: 4.9,
    reviews: 42,
    createdAt: new Date("2024-02-28"),
  },
  {
    id: "prod_6",
    name: "Java Preanger Classic",
    description:
      "Kopi klasik dari dataran tinggi Preanger, Jawa Barat. Warisan budaya kopi Indonesia dengan cita rasa nutty dan chocolate yang elegan.",
    price: 78000,
    image: "/java-preanger-coffee-classic-beans.jpg",
    category: "Arabika",
    origin: "Java",
    roastLevel: "medium",
    weight: 250,
    stock: 45,
    sellerId: "seller_1",
    sellerName: "Kopi Gayo Sejahtera",
    rating: 4.6,
    reviews: 98,
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "prod_7",
    name: "Flores Bajawa Blue",
    description:
      "Single origin dari Bajawa, Flores. Proses full wash menghasilkan keasaman bright dengan notes berry dan floral yang kompleks.",
    price: 92000,
    image: "/flores-bajawa-coffee-beans-blue.jpg",
    category: "Specialty",
    origin: "Flores",
    roastLevel: "light",
    weight: 200,
    stock: 20,
    sellerId: "seller_6",
    sellerName: "Flores Coffee House",
    rating: 4.8,
    reviews: 56,
    createdAt: new Date("2024-03-05"),
  },
  {
    id: "prod_8",
    name: "House Blend Nusantara",
    description:
      "Blend sempurna dari berbagai daerah Indonesia. Kombinasi Arabika dan Robusta untuk keseimbangan rasa yang ideal setiap hari.",
    price: 65000,
    image: "/indonesian-coffee-blend-nusantara.jpg",
    category: "Blend",
    origin: "Sumatra Mandheling",
    roastLevel: "medium",
    weight: 500,
    stock: 80,
    sellerId: "seller_2",
    sellerName: "Warung Kopi Toraja",
    rating: 4.4,
    reviews: 312,
    createdAt: new Date("2024-01-10"),
  },
]

const PRODUCTS_KEY = "kopiloka_products"

export function getProducts(): Product[] {
  if (typeof window === "undefined") return initialProducts
  const saved = localStorage.getItem(PRODUCTS_KEY)
  if (saved) {
    return JSON.parse(saved)
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts))
  return initialProducts
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function addProduct(product: Omit<Product, "id" | "createdAt" | "rating" | "reviews">) {
  const products = getProducts()
  const newProduct: Product = {
    ...product,
    id: `prod_${Date.now()}`,
    createdAt: new Date(),
    rating: 0,
    reviews: 0,
  }
  products.push(newProduct)
  saveProducts(products)
  return newProduct
}

export function updateProduct(productId: string, updates: Partial<Product>) {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === productId)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates }
    saveProducts(products)
    return products[index]
  }
  return null
}

export function deleteProduct(productId: string) {
  const products = getProducts()
  const filtered = products.filter((p) => p.id !== productId)
  saveProducts(filtered)
}

export function getProductsBySeller(sellerId: string): Product[] {
  return getProducts().filter((p) => p.sellerId === sellerId)
}
