'use client'
import { useState } from 'react'

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI estate planning assistant. How can I help you today?", isUser: false }
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    
    setMessages(prev => [
      ...prev,
      { text: input, isUser: true },
      { text: "I'm here to help with estate planning questions! This is a demo response.", isUser: false }
    ])
    setInput('')
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">AI Assistant</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          {isOpen ? 'Minimize' : 'Chat'}
        </button>
      </div>
      
      {isOpen ? (
        <div className="space-y-4">
          <div className="h-32 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`text-sm p-2 rounded ${
                msg.isUser ? 'bg-blue-100 ml-4' : 'bg-gray-100 mr-4'
              }`}>
                {msg.text}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about estate planning..."
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          Click "Chat" to get AI-powered estate planning guidance
        </p>
      )}
    </div>
  )
}