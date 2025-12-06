"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat, type ChatConversation } from "@/lib/chat-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle, Store, User, ArrowLeft, Package } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  const { user } = useAuth()
  const { conversations, activeConversation, setActiveConversation, sendMessage, getConversationsForUser } = useChat()
  const [messageInput, setMessageInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const userConversations = user ? getConversationsForUser(user.id) : []

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeConversation?.messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !activeConversation || !user) return

    sendMessage(activeConversation.id, messageInput.trim(), user.id, user.name, user.role)
    setMessageInput("")
  }

  const getOtherParticipantName = (conv: ChatConversation) => {
    if (!user) return ""
    const otherId = conv.participantIds.find((id) => id !== user.id)
    return otherId ? conv.participantNames[otherId] : ""
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Hari ini"
    if (days === 1) return "Kemarin"
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(date)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Login untuk Chat</h2>
            <p className="text-muted-foreground mb-4">Silakan login terlebih dahulu untuk mengakses fitur chat.</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/login">Login Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Pesan</h1>
          <p className="text-muted-foreground">Chat langsung dengan {user.role === "buyer" ? "penjual" : "pembeli"}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {/* Conversation List */}
          <Card className="lg:col-span-1 border-border/50">
            <CardHeader className="border-b border-border/50 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Percakapan ({userConversations.length})
              </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-65px)]">
              {userConversations.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Belum ada percakapan</p>
                  <p className="text-xs mt-1">Mulai chat dari halaman produk</p>
                </div>
              ) : (
                <div className="p-2">
                  {userConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversation(conv)}
                      className={`w-full p-3 rounded-lg flex items-start gap-3 transition-colors text-left mb-1
                        ${activeConversation?.id === conv.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"}`}
                    >
                      <Avatar className="bg-secondary">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {user.role === "buyer" ? <Store className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm truncate">{getOtherParticipantName(conv)}</p>
                          {conv.lastMessageTime && (
                            <span className="text-xs text-muted-foreground">{formatDate(conv.lastMessageTime)}</span>
                          )}
                        </div>
                        {conv.productName && <p className="text-xs text-primary truncate">{conv.productName}</p>}
                        {conv.lastMessage && (
                          <p className="text-xs text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs">{conv.unreadCount}</Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 border-border/50 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-border/50 py-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={() => setActiveConversation(null)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Avatar className="bg-secondary">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {user.role === "buyer" ? <Store className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{getOtherParticipantName(activeConversation)}</h3>
                      {activeConversation.productName && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Package className="w-3 h-3" />
                          {activeConversation.productName}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {activeConversation.messages.map((message) => {
                      const isOwn = message.senderId === user.id
                      return (
                        <div key={message.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                          <Avatar className={isOwn ? "bg-primary" : "bg-secondary"}>
                            <AvatarFallback
                              className={
                                isOwn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                              }
                            >
                              {message.senderRole === "seller" ? (
                                <Store className="w-4 h-4" />
                              ) : (
                                <User className="w-4 h-4" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`max-w-[70%] ${isOwn ? "text-right" : ""}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isOwn
                                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                                  : "bg-muted text-foreground rounded-tl-sm"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1 inline-block">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-border/50">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Ketik pesan..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!messageInput.trim()} className="bg-primary hover:bg-primary/90">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <MessageCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Pilih Percakapan</h3>
                  <p className="text-muted-foreground text-sm">
                    Pilih percakapan dari daftar di samping atau mulai chat baru dari halaman produk
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
