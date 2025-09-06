'use client'

import { useEffect, useRef, useState } from 'react'
import { postChat, getChatHistory, ChatMessage, ChatMeta } from '../../lib/api'

type Props = {
  userId?: string
  initialThreadId?: string
  height?: number
}

export default function AIChat(props: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [threadId, setThreadId] = useState<string | undefined>(props.initialThreadId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!threadId) return
    let cancelled = false

    async function load() {
      try {
        const history = await getChatHistory({ threadId })
        if (!cancelled) setMessages(history)
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load history')
      }
    }

    load()
    const id = setInterval(load, 2000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [threadId])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  async function onSend() {
    const text = input.trim()
    if (!text) return
    setInput('')
    setLoading(true)
    setError(null)

    const localId = `${Date.now()}`
    setMessages(prev => [...prev, { id: localId, role: 'user', content: text }])

    try {
      const meta: ChatMeta = await postChat({
        message: text,
        threadId,
        userId: props.userId
      })
      if (!threadId) setThreadId(meta.threadId)

      // optimistic wait then refresh history once
      setTimeout(async () => {
        try {
          const history = await getChatHistory({ threadId: meta.threadId })
          setMessages(history)
        } catch {}
      }, 900)
    } catch (e: any) {
      setError(e.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const h = props.height ?? 380

  return (
    <div className="w-full max-w-3xl rounded-2xl border p-4 shadow-sm">
      <div className="font-semibold mb-2">AI Assistant</div>
      <div
        ref={scrollRef}
        style={{ height: h }}
        className="w-full overflow-y-auto rounded-md border p-3 bg-white"
      >
        {messages.length === 0 && (
          <div className="text-sm text-gray-500">No messages yet</div>
        )}
        {messages.map(m => (
          <div key={m.id} className="mb-3">
            <div className="text-xs text-gray-500">{m.role === 'user' ? 'You' : 'Assistant'}</div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">Thinking...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      <div className="mt-3 flex gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 rounded-md border p-2"
          rows={2}
        />
        <button
          onClick={onSend}
          disabled={loading || input.trim().length === 0}
          className="rounded-md border px-3 py-2 font-medium disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
