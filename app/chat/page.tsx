"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, ArrowLeft, Wand2, Download, Copy, Heart } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  imageUrl?: string
  isGenerating?: boolean
}

export default function CreatePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Welcome to Imagify! I'm your AI image generation assistant. Describe the image you'd like to create in detail, and I'll bring your vision to life. Be specific about style, colors, composition, and mood for the best results.",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasUserMessage, setHasUserMessage] = useState(false)

  const saveImage = async (imageUrl: string) => {
    try {
      // Convert base64 to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setHasUserMessage(true)

    // Add generating message
    const generatingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "Creating your image with AI... This may take a few moments.",
      role: "assistant",
      timestamp: new Date(),
      isGenerating: true,
    }

    setMessages((prev) => [...prev, generatingMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      
      if (!data.success || !data.imageData) {
        throw new Error("Invalid response from server");
      }

      const responseMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Here's your generated image! I've created it based on your description.",
        role: "assistant",
        timestamp: new Date(),
        imageUrl: `data:image/png;base64,${data.imageData}`,
      }

      setMessages((prev) => prev.filter((msg) => !msg.isGenerating).concat(responseMessage))
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, I encountered an error while generating your image. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => prev.filter((msg) => !msg.isGenerating).concat(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="https://acolyte-sandbox.vercel.app/">
                <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Imagify Studio</h1>
                  <p className="text-sm text-gray-600">AI Image Generation</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              Ready to Create
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col h-[calc(100vh-180px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-8 mb-8 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-4 ${
                  message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="w-10 h-10 shadow-md">
                  <AvatarFallback className={message.role === "user" ? "bg-blue-100" : "bg-blue-100"}>
                    {message.role === "user" ? (
                      <User className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Bot className="w-5 h-5 text-blue-600" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex-1 max-w-4xl ${message.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block p-5 rounded-2xl shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                        : "bg-white border border-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm leading-relaxed mb-2">{message.content}</p>

                    {message.isGenerating && (
                      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">Generating your image...</span>
                      </div>
                    )}

                    {message.imageUrl && (
                      <div className="mt-6">
                        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <div className="relative group">
                            <img
                              src={message.imageUrl || "/placeholder.svg"}
                              alt="Generated image"
                              className="w-full h-auto max-w-lg mx-auto rounded-t-lg"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-t-lg" />
                          </div>
                          <div className="p-4 bg-white border-t">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Wand2 className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-900">AI Generated</span>
                                <Badge variant="outline" className="text-xs">
                                  High Quality
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Heart className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8"
                                  onClick={() => saveImage(message.imageUrl!)}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {message.role === "user" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your image in detail... (e.g., 'A majestic mountain landscape at sunset with golden light reflecting on a crystal clear lake')"
                    className="min-h-[56px] text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-14 w-14 p-0 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <p>💡 Be specific about style, colors, lighting, and composition for best results</p>
                <p>{input.length}/500</p>
              </div>
            </form>
          </Card>

          {/* Quick Prompts */}
          {!hasUserMessage && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Quick Start Prompts:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "A serene Japanese garden with cherry blossoms",
                  "Futuristic cityscape at night with neon lights",
                  "Abstract geometric pattern in vibrant colors",
                  "Vintage portrait in black and white",
                ].map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    className="text-xs hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => setInput(prompt)}
                    disabled={isLoading}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
