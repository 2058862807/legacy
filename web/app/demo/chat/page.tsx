'use client'
import React, { useState } from 'react'
import Link from 'next/link'

export default function DemoChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm Esquire AI, your legal assistant. I can help you with estate planning questions, will creation, and legal guidance. How can I assist you today?",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      type: 'user', 
      content: "I need help creating a will for my estate.",
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      type: 'bot',
      content: "I'd be happy to help you create a will! Let me gather some basic information:\n\n1. What state are you located in? (This affects legal requirements)\n2. Do you have any existing estate planning documents?\n3. What are your main assets you'd like to include?\n4. Do you have beneficiaries in mind?\n\nI'll ensure everything complies with your state's laws and best practices.",
      timestamp: new Date(Date.now() - 180000)
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: newMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on your state's laws, I recommend...",
        "For estate planning in your situation, you'll want to consider...",
        "I can help you draft that. Here are the key elements to include...",
        "Let me break this down for you step by step...",
        "Based on current legal standards, the best approach would be..."
      ]

      const botMessage = {
        id: messages.length + 2,
        type: 'bot' as const,
        content: responses[Math.floor(Math.random() * responses.length)] + "\n\nWould you like me to help you create a specific document or need more information about any particular aspect?",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Esquire AI Assistant</h1>
              <span className="ml-3 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                DEMO MODE
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/demo/dashboard"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-purple-50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">AI</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Esquire AI</h3>
                <p className="text-sm text-gray-500">Legal Assistant • Always Available</p>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about estate planning, wills, or legal questions..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || !newMessage.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setNewMessage("How do I create a basic will?")}
            className="p-4 text-left bg-white rounded-lg border hover:border-purple-300 hover:shadow-md transition-all"
          >
            <h4 className="font-medium text-gray-900 mb-1">Create a Will</h4>
            <p className="text-sm text-gray-600">Get started with will creation basics</p>
          </button>
          
          <button 
            onClick={() => setNewMessage("What are the requirements for my state?")}
            className="p-4 text-left bg-white rounded-lg border hover:border-purple-300 hover:shadow-md transition-all"
          >
            <h4 className="font-medium text-gray-900 mb-1">State Requirements</h4>
            <p className="text-sm text-gray-600">Learn about state-specific laws</p>
          </button>
          
          <button 
            onClick={() => setNewMessage("I'm dealing with grief, can you help?")}
            className="p-4 text-left bg-white rounded-lg border hover:border-purple-300 hover:shadow-md transition-all"
          >
            <h4 className="font-medium text-gray-900 mb-1">Grief Support</h4>
            <p className="text-sm text-gray-600">Access our grief counseling bot</p>
          </button>
        </div>

        {/* Features */}
        <div className="mt-6 bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Legal Expertise</h4>
                <p className="text-sm text-gray-600">Trained on estate planning law</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">50-State Compliance</h4>
                <p className="text-sm text-gray-600">Knowledge of all state laws</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Grief Support</h4>
                <p className="text-sm text-gray-600">Compassionate assistance</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">24/7 Available</h4>
                <p className="text-sm text-gray-600">Always ready to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}