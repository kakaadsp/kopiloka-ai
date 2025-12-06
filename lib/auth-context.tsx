"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "buyer" | "seller"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  storeName?: string
  storeDescription?: string
  phone?: string
  address?: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
}

interface RegisterData {
  email: string
  password: string
  name: string
  role: UserRole
  storeName?: string
  storeDescription?: string
  phone?: string
  address?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simulated user database
const USERS_KEY = "kopiloka_users"
const CURRENT_USER_KEY = "kopiloka_current_user"

const DEMO_ACCOUNTS: User[] = [
  {
    id: "demo_buyer_001",
    email: "buyer@kopiloka.id",
    name: "Budi Santoso",
    role: "buyer",
    phone: "081234567890",
    address: "Jl. Sudirman No. 123, Jakarta",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "demo_seller_001",
    email: "seller@kopiloka.id",
    name: "Pak Joko Kopi",
    role: "seller",
    storeName: "Warung Kopi Joko",
    storeDescription: "Kopi pilihan dari petani lokal Toraja dan Gayo. Freshly roasted setiap minggu.",
    phone: "081298765432",
    address: "Jl. Kopi Raya No. 45, Bandung",
    createdAt: new Date("2024-01-01"),
  },
]

// Demo password (same for both accounts for simplicity)
const DEMO_PASSWORD = "demo123"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
  }

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

    // Check demo accounts first
    const demoUser = DEMO_ACCOUNTS.find((u) => u.email === email)
    if (demoUser && password === DEMO_PASSWORD) {
      setUser(demoUser)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser))
      setIsLoading(false)
      return true
    }

    // Check registered users
    const users = getUsers()
    const foundUser = users.find((u) => u.email === email)

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

    const users = getUsers()
    const existingUser = users.find((u) => u.email === data.email)

    if (existingUser) {
      setIsLoading(false)
      return false
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      storeName: data.storeName,
      storeDescription: data.storeDescription,
      phone: data.phone,
      address: data.address,
      createdAt: new Date(),
    }

    users.push(newUser)
    saveUsers(users)
    setUser(newUser)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
