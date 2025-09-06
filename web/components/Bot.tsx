import React, { useState, useRef } from 'react'
import { Maximize2, Minimize2, Send, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/api'

export default function Bot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()

  // Feature flags
  const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED !== 'false'

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return
    if (!AI_ENABLED) {
      setMessages(prev => [...prev, 
        { role: 'user', content: inputValue },
        { role: 'assistant', content: 'AI features are currently disabled. Coming soon!' }
      ])
      setInputValue('')
      return
    }

    const userMessage = inputValue.trim()
    setInputValue('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch(api('/ai/esquire'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: userMessage,
          user_context: session?.user?.email || 'anonymous'
        }),
      })

      const data = await response.json()
      
      if (data.status === 'success') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Sorry, I encountered an error. Please try again.' }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m currently unavailable. Please try again later.' }])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        aria-label="Open Esquire AI"
      >
        <span className="text-xl">⚖️</span>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Esquire AI Legal Assistant
        </div>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-12' : 'w-96 h-[32rem]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚖️</span>
          <h3 className="font-semibold text-gray-800">Esquire AI</h3>
          {!AI_ENABLED && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Coming Soon</span>}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 h-80 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 space-y-2">
                <p className="font-medium">👋 Hi! I'm Esquire AI</p>
                <p className="text-sm">I can help with estate planning questions, but please consult a licensed attorney for specific legal advice.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[85%]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={AI_ENABLED ? "Ask about estate planning..." : "Coming soon..."}
                disabled={!AI_ENABLED || isLoading}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || !AI_ENABLED}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}