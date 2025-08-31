'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AIChatAssistant() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Esquire AI, your estate planning assistant. How can I help you today?", isUser: false }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { text: userMessage, isUser: true }])
    setIsLoading(true)
    
    try {
      const userEmail = session?.user?.email || 'anonymous@example.com'
      const response = await fetch(`/api/bot/help?user_email=${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: `chat_${Date.now()}`
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { text: data.reply, isUser: false }])
      } else {
        setMessages(prev => [...prev, { 
          text: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.", 
          isUser: false 
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I'm currently unavailable. Please try again later or contact support.", 
        isUser: false 
      }])
    } finally {
      setIsLoading(false)
    }
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