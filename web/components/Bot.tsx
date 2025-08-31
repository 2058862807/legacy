'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { apiFetch } from '../lib/api'

interface BotMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface HelpBotProps {
  type: 'help' | 'grief'
}

export default function Bot({ type }: HelpBotProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<BotMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  const addMessage = (text: string, isUser: boolean) => {
    const message: BotMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
  }

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage = input.trim()
    setInput('')
    addMessage(userMessage, true)
    setIsLoading(true)

    try {
      // Show crisis resources on first grief bot message
      if (type === 'grief' && messages.length === 0) {
        addMessage(
          'I understand you may be going through a difficult time. Here are some crisis resources:\n\n' +
          '• National Suicide Prevention Lifeline: 988\n' +
          '• Crisis Text Line: Text HOME to 741741\n' +
          '• National Alliance on Mental Illness: 1-800-950-6264\n\n' +
          'Please note: I cannot provide medical advice. For emergencies, call 911.',
          false
        )
      }

      const endpoint = type === 'help' ? '/api/bot/help' : '/api/bot/grief'
      const userEmail = session?.user?.email || 'anonymous@example.com'
      const response = await apiFetch<{ reply: string; escalate?: boolean }>(`${endpoint}?user_email=${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        body: JSON.stringify({ 
          message: userMessage, 
          session_id: sessionId,
          history: messages 
        })
      })

      addMessage(response.reply, false)

      if (response.escalate) {
        addMessage(
          'Based on your message, I recommend speaking with a professional. Would you like me to provide some resources?',
          false
        )
      }
    } catch (error) {
      addMessage('Sorry, I encountered an error. Please try again later.', false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          {type === 'help' ? '⚖️' : '💬'} {type === 'help' ? 'Esquire AI' : 'Support'}
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">
              {type === 'help' ? 'Esquire AI' : 'Grief Support'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map(message => (
              <div
                key={message.id}
                className={`${
                  message.isUser 
                    ? 'ml-8 bg-blue-600 text-white' 
                    : 'mr-8 bg-gray-100'
                } p-3 rounded-lg whitespace-pre-wrap`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="mr-8 bg-gray-100 p-3 rounded-lg">
                Thinking...
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-3 py-2"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}