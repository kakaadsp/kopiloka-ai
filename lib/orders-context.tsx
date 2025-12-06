"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  seller: string
}

export interface TrackingEvent {
  date: Date
  status: string
  location: string
  description: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalPrice: number
  shippingCost: number
  grandTotal: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
  trackingNumber?: string
  courier?: string
  trackingEvents?: TrackingEvent[]
}

interface OrdersContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => Order
  getOrdersByUser: (userId: string) => Order[]
  getOrderById: (orderId: string) => Order | undefined
  getOrdersBySeller: (sellerId: string) => Order[]
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

const initialOrders: Order[] = [
  {
    id: "KPL-12345678",
    userId: "demo_buyer_001",
    items: [
      {
        productId: "1",
        productName: "Kopi Arabika Toraja Premium",
        productImage: "/toraja-coffee-beans.jpg",
        quantity: 2,
        price: 185000,
        seller: "Kopi Toraja Asli",
      },
      {
        productId: "2",
        productName: "Kopi Robusta Lampung",
        productImage: "/robusta-coffee-beans.png",
        quantity: 1,
        price: 85000,
        seller: "Robusta Nusantara",
      },
    ],
    totalPrice: 455000,
    shippingCost: 15000,
    grandTotal: 470000,
    status: "processing",
    shippingAddress: {
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Sudirman No. 123",
      city: "Jakarta",
      postalCode: "12345",
    },
    paymentMethod: "transfer",
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 43200000),
  },
  {
    id: "KPL-87654321",
    userId: "demo_buyer_001",
    items: [
      {
        productId: "3",
        productName: "Kopi Gayo Aceh Specialty",
        productImage: "/gayo-coffee-beans.jpg",
        quantity: 1,
        price: 225000,
        seller: "Gayo Highland Coffee",
      },
    ],
    totalPrice: 225000,
    shippingCost: 25000,
    grandTotal: 250000,
    status: "shipped",
    shippingAddress: {
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Sudirman No. 123",
      city: "Jakarta",
      postalCode: "12345",
    },
    paymentMethod: "transfer",
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
    trackingNumber: "JNE1234567890",
    courier: "JNE Express",
    trackingEvents: [
      {
        date: new Date(Date.now() - 86400000),
        status: "Paket Dikirim",
        location: "Warehouse Aceh",
        description: "Paket telah diserahkan ke kurir JNE Express",
      },
      {
        date: new Date(Date.now() - 72000000),
        status: "Dalam Perjalanan",
        location: "Hub Medan",
        description: "Paket tiba di hub sortir Medan",
      },
      {
        date: new Date(Date.now() - 43200000),
        status: "Dalam Perjalanan",
        location: "Hub Jakarta",
        description: "Paket tiba di hub sortir Jakarta",
      },
      {
        date: new Date(Date.now() - 14400000),
        status: "Sedang Diantar",
        location: "Jakarta Pusat",
        description: "Paket sedang dalam proses pengantaran oleh kurir",
      },
    ],
  },
  {
    id: "KPL-11223344",
    userId: "demo_buyer_001",
    items: [
      {
        productId: "4",
        productName: "Kopi Kintamani Bali",
        productImage: "/kintamani-coffee.jpg",
        quantity: 3,
        price: 165000,
        seller: "Bali Coffee Farm",
      },
    ],
    totalPrice: 495000,
    shippingCost: 25000,
    grandTotal: 520000,
    status: "delivered",
    shippingAddress: {
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Sudirman No. 123",
      city: "Jakarta",
      postalCode: "12345",
    },
    paymentMethod: "cod",
    createdAt: new Date(Date.now() - 604800000),
    updatedAt: new Date(Date.now() - 518400000),
    trackingNumber: "SICEPAT9876543210",
    courier: "SiCepat",
    trackingEvents: [
      {
        date: new Date(Date.now() - 604800000),
        status: "Paket Dikirim",
        location: "Warehouse Bali",
        description: "Paket telah diserahkan ke kurir SiCepat",
      },
      {
        date: new Date(Date.now() - 561600000),
        status: "Dalam Perjalanan",
        location: "Hub Surabaya",
        description: "Paket tiba di hub sortir Surabaya",
      },
      {
        date: new Date(Date.now() - 532800000),
        status: "Dalam Perjalanan",
        location: "Hub Jakarta",
        description: "Paket tiba di hub sortir Jakarta",
      },
      {
        date: new Date(Date.now() - 518400000),
        status: "Terkirim",
        location: "Jakarta Pusat",
        description: "Paket telah diterima oleh Budi Santoso",
      },
    ],
  },
]

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  const addOrder = (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `KPL-${Date.now().toString().slice(-8)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setOrders((prev) => [newOrder, ...prev])
    return newOrder
  }

  const getOrdersByUser = (userId: string): Order[] => {
    return orders.filter((order) => order.userId === userId)
  }

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId)
  }

  const getOrdersBySeller = (sellerId: string): Order[] => {
    return orders.filter((order) => order.items.some((item) => item.seller === sellerId))
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              updatedAt: new Date(),
            }
          : order,
      ),
    )
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        getOrdersByUser,
        getOrderById,
        getOrdersBySeller,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
