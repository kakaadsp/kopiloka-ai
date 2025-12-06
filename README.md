# ☕ KopiLoka - Full-Stack Coffee Marketplace dengan AI Assistant

## 🏆 Hackathon IMPHEN Submission
**Tema:** Inovasi AI: Mendorong Usaha Lokal dengan AI Inklusif  
**Live Demo:** [https://kopiloka-ai.vercel.app/](https://kopiloka-ai.vercel.app/)  
**Repository:** [https://github.com/kopiloka/kopiloka-ai](https://github.com/kopiloka/kopiloka-ai)

## 📋 Daftar Isi
- [Overview](#-overview)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur Teknologi](#-arsitektur-teknologi)
- [Struktur Project](#-struktur-project)
- [Installasi & Setup](#-installasi--setup)
- [API Documentation](#-api-documentation)
- [Development Guidelines](#-development-guidelines)
- [Deployment](#-deployment)
- [Tim Pengembang](#-tim-pengembang)
- [License](#-license)

## 🌟 Overview

KopiLoka adalah platform e-commerce khusus kopi yang menghubungkan penjual kopi lokal dengan pecinta kopi di seluruh Indonesia. Platform ini dilengkapi dengan AI Assistant berbasis Google Gemini yang memberikan rekomendasi personal, menjawab pertanyaan seputar kopi, dan membantu proses pembelian.

### 🎯 Tujuan
1. **Mendorong UMKM Lokal** - Memberikan platform digital untuk penjual kopi tradisional
2. **AI Inklusif** - Mengintegrasikan AI yang mudah digunakan oleh semua kalangan
3. **Edukasi Kopi** - Meningkatkan pengetahuan tentang kopi Indonesia
4. **Pengalaman Belanja Premium** - UX/UX yang modern dan intuitif

## ✨ Fitur Utama

### 🤖 **AI Assistant KopiLoka**
- Rekomendasi kopi berdasarkan preferensi pribadi
- Chat interaktif tentang segala hal terkait kopi
- Panduan brewing dan penyimpanan kopi
- Analisis rasa dan pairing recommendations

### 🛍️ **Marketplace Terpadu**
- Katalog produk kopi dari berbagai daerah
- Filter berdasarkan jenis, daerah, roast level, dan harga
- Review dan rating sistem
- Wishlist dan produk favorit

### 📊 **Dashboard Multihak**
- **Pembeli:** Tracking pesanan, riwayat belanja, chat dengan penjual
- **Penjual:** Manajemen produk, pemantauan pesanan, analisis penjualan
- **Admin:** Monitoring platform, user management, content moderation

### 🔄 **Alur Transaksi Lengkap**
1. Pencarian produk → 2. Detail produk → 3. Keranjang belanja → 4. Checkout → 5. Pembayaran → 6. Tracking pengiriman → 7. Review

### 💬 **Sistem Komunikasi Real-time**
- Chat langsung pembeli-penjual
- Notifikasi status pesanan
- Broadcast promosi dari penjual

## 🛠️ Arsitektur Teknologi

### **Frontend Stack**
```
Next.js 14 (App Router) │ TypeScript │ Tailwind CSS │ shadcn/ui
React Server Components │ Zustand    │ React Query  │ React Hook Form
```

### **Backend Stack**
```
Next.js API Routes │ Google Gemini API │ PostgreSQL/Supabase
JWT Authentication │ Uploadthing       │ Resend (Email)
```

### **Infrastructure**
```
Vercel (Deployment)  │ Supabase (Database)  │ GitHub Actions (CI/CD)
Uploadthing (Storage)│ Resend (Email)       │ Clerk/Auth.js (Auth)
```

## 📁 Struktur Project

```
kopiloka-ai/
├── 📁 app/                            # Next.js App Router
│   ├── 📁 ai-assistant/              # Halaman AI Assistant
│   │   ├── page.tsx                  # Main AI Assistant page
│   │   └── components/               # AI-specific components
│   ├── 📁 api/                       # Backend API Routes
│   │   ├── 📁 chat/                  # AI Chat endpoints
│   │   │   ├── route.ts              # Gemini AI integration
│   │   │   └── types.ts              # Type definitions
│   │   ├── 📁 products/              # Product management
│   │   ├── 📁 orders/                # Order processing
│   │   └── 📁 auth/                  # Authentication
│   ├── 📁 cart/                      # Shopping cart page
│   ├── 📁 chat/                      # User-to-user chat
│   ├── 📁 checkout/                  # Checkout process
│   ├── 📁 dashboard/                 # User dashboard
│   │   ├── 📁 buyer/                 # Buyer dashboard
│   │   └── 📁 seller/                # Seller dashboard
│   ├── 📁 login/                     # Login page
│   ├── 📁 marketplace/               # Product listings
│   ├── 📁 orders/                    # Order history & details
│   ├── 📁 product/                   # Product detail pages
│   │   └── 📁 [id]/                  # Dynamic product routes
│   ├── 📁 register/                  # Registration page
│   ├── 📁 seller/                    # Seller portal
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Homepage
│   └── globals.css                   # Global styles
├── 📁 components/                    # Reusable UI components
│   ├── 📁 ui/                        # shadcn/ui components
│   ├── 📁 marketplace/               # Marketplace components
│   ├── 📁 product/                   # Product components
│   ├── 📁 chat/                      # Chat components
│   └── 📁 layout/                    # Layout components
├── 📁 hooks/                         # Custom React hooks
│   ├── useCart.ts                    # Cart management
│   ├── useChat.ts                    # Chat functionality
│   └── useProducts.ts                # Products fetching
├── 📁 lib/                           # Utility libraries
│   ├── gemini.ts                     # Gemini API client
│   ├── supabase.ts                   # Database client
│   ├── validation.ts                 # Form validations
│   └── utils.ts                      # Helper functions
├── 📁 public/                        # Static assets
├── 📁 styles/                        # Additional styles
├── package.json                      # Dependencies
├── next.config.mjs                   # Next.js config
└── tsconfig.json                     # TypeScript config
```

## 🚀 Installasi & Setup

### **Prerequisites**
- Node.js 18.17.0 or later
- pnpm, npm, or yarn
- Google Gemini API Key
- Supabase account (for database)

### **Setup Local Development**

```bash
# 1. Clone repository
git clone https://github.com/kopiloka/kopiloka-ai.git
cd kopiloka-ai

# 2. Install dependencies
pnpm install  # or npm install / yarn install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Configure environment variables
# Edit .env.local dengan konfigurasi Anda
```

### **Environment Variables (.env.local)**
```env
# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication (Optional)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Uploadthing (File Uploads)
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
```

### **Run Development Server**
```bash
# Development mode
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📚 API Documentation

### **AI Chat API** (`POST /api/chat`)
```typescript
// Request Body
{
  "message": "Rekomendasi kopi untuk pemula",
  "userId": "user_123",
  "context": {
    "previousMessages": [...],
    "userPreferences": {...}
  }
}

// Response
{
  "success": true,
  "response": "Untuk pemula, saya rekomendasikan...",
  "recommendations": [...],
  "conversationId": "conv_123"
}
```

### **Products API**
```typescript
// GET /api/products - Get all products
// GET /api/products/[id] - Get product detail
// POST /api/products - Create new product (seller only)
// PUT /api/products/[id] - Update product
// DELETE /api/products/[id] - Delete product
```

### **Orders API**
```typescript
// POST /api/orders - Create new order
// GET /api/orders - Get user orders
// GET /api/orders/[id] - Get order detail
// PUT /api/orders/[id]/status - Update order status
```

### **Authentication API**
```typescript
// POST /api/auth/register - Register new user
// POST /api/auth/login - User login
// POST /api/auth/logout - User logout
// GET /api/auth/session - Get current session
```

## 🔧 Development Guidelines

### **Code Structure**
```typescript
// Contoh struktur component
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/useProducts"
import { Product } from "@/types/product"

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useProducts()
  
  return (
    <div className="product-card">
      <Image src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <Button onClick={() => addToCart(product)}>
        Tambah ke Keranjang
      </Button>
    </div>
  )
}
```

### **State Management**
```typescript
// Menggunakan Zustand untuk global state
import { create } from 'zustand'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(item => item.id !== id) 
  })),
  clearCart: () => set({ items: [] }),
}))
```

### **Database Schema (Supabase)**
```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'buyer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  origin TEXT,
  roast_level TEXT,
  stock INTEGER DEFAULT 0,
  images TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🌐 Deployment

### **Deploy ke Vercel**
```bash
# 1. Push ke GitHub
git push origin main

# 2. Import project di Vercel
# 3. Configure environment variables
# 4. Deploy otomatis
```

### **Vercel Environment Variables**
```
GOOGLE_GEMINI_API_KEY=production_key
NEXT_PUBLIC_SUPABASE_URL=production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=production_key
# ... dan lainnya
```

### **Database Setup (Supabase)**
1. Buat project baru di Supabase
2. Jalankan schema SQL di SQL Editor
3. Setup Row Level Security (RLS)
4. Dapatkan API keys untuk environment variables

## 👥 Tim Pengembang

### **👨‍💻 Tech Team**
| Role | Nama | Kontribusi |
|------|------|------------|
| **Project Lead** | **Galih Aji Pangestu** | System Architecture & Product Strategy |
| **Full-Stack Dev** | **Rahmad** | Backend API & Database Integration |
| **Frontend Dev** | **Rikow** | UI/UX Implementation & Components |
| **AI Engineer** | **Stevyka** | Gemini AI Integration & NLP |
| **Business Dev** | **Kaka Dimas S.P** | Market Research & Partnerships |

### **Development Workflow**
1. **Planning** - Product requirements & technical specs
2. **Development** - Feature branches & pull requests
3. **Testing** - Unit tests & integration tests
4. **Review** - Code review & quality assurance
5. **Deployment** - Staging → Production

## 📞 Kontak & Support

- **Website:** [https://kopiloka-ai.vercel.app](https://kopiloka-ai.vercel.app)
- **GitHub:** [https://github.com/kopiloka](https://github.com/kopiloka)
- **Email:** team@kopiloka.id
- **Issue Tracker:** [GitHub Issues](https://github.com/kopiloka/kopiloka-ai/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Roadmap Pengembangan

### **Versi 1.0 (Current)**
- ✅ AI Assistant dengan Gemini API
- ✅ Marketplace dasar
- ✅ Authentication system
- ✅ Shopping cart & checkout

### **Versi 1.1 (Next Release)**
- [ ] Payment gateway integration
- [ ] Real-time chat dengan WebSocket
- [ ] Mobile app (React Native)
- [ ] Advanced AI features

### **Versi 2.0 (Future)**
- [ ] International shipping
- [ ] Wholesale marketplace
- [ ] Coffee subscription service
- [ ] AR product visualization

---

**#KopiLoka #HackathonIMPHEN #AIIndonesia #TechForGood #CoffeeTech #DigitalUMKM**

---

*"Dari biji kopi lokal ke cangkir di seluruh Indonesia, didukung oleh teknologi yang inklusif dan berdampak nyata."*
