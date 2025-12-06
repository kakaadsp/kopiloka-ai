"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Bot,
  User,
  Coffee,
  Sparkles,
  MessageCircle,
  Lightbulb,
  ShoppingBag,
  HelpCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

const suggestedQuestions = [
  {
    icon: Coffee,
    text: "Rekomendasikan kopi untuk pemula",
    category: "Rekomendasi",
  },
  {
    icon: Lightbulb,
    text: "Cara menyeduh kopi V60 yang benar",
    category: "Tips",
  },
  {
    icon: ShoppingBag,
    text: "Kopi arabika terbaik di marketplace",
    category: "Produk",
  },
  {
    icon: HelpCircle,
    text: "Perbedaan arabika dan robusta",
    category: "Edukasi",
  },
]

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
      }

      setMessages([...newMessages, assistantMessage])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedClick = (question: string) => {
    sendMessage(question)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">KOPI AI Assistant</h1>
          <p className="text-muted-foreground">Asisten virtual cerdas untuk semua kebutuhan kopi Anda</p>
        </div>

        {/* Chat Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="border-b border-border/50 bg-card">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Coffee className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
              </div>
              <div>
                <CardTitle className="text-lg">KOPI AI</CardTitle>
                <p className="text-sm text-muted-foreground">Online - Siap membantu</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Selamat datang di KOPI AI!</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Tanyakan apa saja tentang kopi - dari rekomendasi produk, cara menyeduh, hingga tips untuk penjual
                    kopi.
                  </p>

                  {/* Suggested Questions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSuggestedClick(q.text)}
                        disabled={isLoading}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border/50 
                                   hover:border-primary/50 hover:bg-primary/5 transition-all text-left group
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <q.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{q.text}</p>
                          <p className="text-xs text-muted-foreground">{q.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className={message.role === "user" ? "bg-secondary" : "bg-primary"}>
                        <AvatarFallback
                          className={
                            message.role === "user"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-primary text-primary-foreground"
                          }
                        >
                          {message.role === "user" ? <User className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted text-foreground rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content || (message.role === "assistant" && isLoading ? "" : message.content)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && messages[messages.length - 1]?.content === "" && (
                    <div className="flex gap-3">
                      <Avatar className="bg-primary">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Coffee className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-3">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50 bg-muted/30">
              <form onSubmit={onSubmit} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Tanyakan tentang kopi..."
                  className="flex-1 bg-background border-border/50 focus-visible:ring-primary"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                KOPI AI dapat membuat kesalahan. Verifikasi informasi penting.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
