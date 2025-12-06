"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: "buyer" | "seller"
  content: string
  timestamp: Date
}

export interface ChatConversation {
  id: string
  participantIds: string[]
  participantNames: { [key: string]: string }
  productId?: string
  productName?: string
  messages: ChatMessage[]
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
}

interface ChatContextType {
  conversations: ChatConversation[]
  activeConversation: ChatConversation | null
  setActiveConversation: (conv: ChatConversation | null) => void
  sendMessage: (
    conversationId: string,
    content: string,
    senderId: string,
    senderName: string,
    senderRole: "buyer" | "seller",
  ) => void
  startConversation: (
    buyerId: string,
    buyerName: string,
    sellerId: string,
    sellerName: string,
    productId?: string,
    productName?: string,
  ) => ChatConversation
  getConversationsForUser: (userId: string) => ChatConversation[]
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Mock conversations data
const initialConversations: ChatConversation[] = [
  {
    id: "conv-1",
    participantIds: ["buyer-1", "seller-1"],
    participantNames: { "buyer-1": "Budi Santoso", "seller-1": "Kopi Toraja Asli" },
    productId: "1",
    productName: "Kopi Arabika Toraja Premium",
    messages: [
      {
        id: "msg-1",
        senderId: "buyer-1",
        senderName: "Budi Santoso",
        senderRole: "buyer",
        content: "Halo, apakah kopi ini masih tersedia?",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "msg-2",
        senderId: "seller-1",
        senderName: "Kopi Toraja Asli",
        senderRole: "seller",
        content: "Halo Kak! Masih tersedia, stok kami masih banyak. Ada yang bisa dibantu?",
        timestamp: new Date(Date.now() - 3500000),
      },
      {
        id: "msg-3",
        senderId: "buyer-1",
        senderName: "Budi Santoso",
        senderRole: "buyer",
        content: "Kalau beli 3 pack bisa dapat diskon?",
        timestamp: new Date(Date.now() - 3400000),
      },
    ],
    lastMessage: "Kalau beli 3 pack bisa dapat diskon?",
    lastMessageTime: new Date(Date.now() - 3400000),
    unreadCount: 1,
  },
]

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations)
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null)

  const sendMessage = (
    conversationId: string,
    content: string,
    senderId: string,
    senderName: string,
    senderRole: "buyer" | "seller",
  ) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      senderRole,
      content,
      timestamp: new Date(),
    }

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: content,
              lastMessageTime: new Date(),
            }
          : conv,
      ),
    )

    if (activeConversation?.id === conversationId) {
      setActiveConversation((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMessage],
              lastMessage: content,
              lastMessageTime: new Date(),
            }
          : null,
      )
    }
  }

  const startConversation = (
    buyerId: string,
    buyerName: string,
    sellerId: string,
    sellerName: string,
    productId?: string,
    productName?: string,
  ): ChatConversation => {
    // Check if conversation already exists
    const existing = conversations.find(
      (conv) => conv.participantIds.includes(buyerId) && conv.participantIds.includes(sellerId),
    )

    if (existing) {
      setActiveConversation(existing)
      return existing
    }

    const newConversation: ChatConversation = {
      id: `conv-${Date.now()}`,
      participantIds: [buyerId, sellerId],
      participantNames: { [buyerId]: buyerName, [sellerId]: sellerName },
      productId,
      productName,
      messages: [],
      unreadCount: 0,
    }

    setConversations((prev) => [...prev, newConversation])
    setActiveConversation(newConversation)
    return newConversation
  }

  const getConversationsForUser = (userId: string): ChatConversation[] => {
    return conversations.filter((conv) => conv.participantIds.includes(userId))
  }

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        setActiveConversation,
        sendMessage,
        startConversation,
        getConversationsForUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
