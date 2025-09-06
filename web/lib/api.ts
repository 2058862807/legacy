/**
 * web/lib/api.ts
 * Single API client with strict JSON handling.
 */

export type ApiResponse<T> = {
  ok: boolean
  data?: T
  error?: string
}

function getBase() {
  const base = process.env.NEXT_PUBLIC_API_URL || ""
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set")
  return base.replace(/\/$/, "")
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getBase()}${path}`, {
    method: init?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    credentials: "include",
    body: init?.body
  })

  let json: ApiResponse<T> | null = null
  try {
    json = await res.json()
  } catch {
    // ignore parse error, will throw below
  }

  if (!res.ok || !json || json.ok !== true) {
    const message = (json && json.error) ? json.error : `HTTP ${res.status}`
    throw new Error(message)
  }

  if (!json.data) {
    throw new Error("Malformed response")
  }

  return json.data
}

/** AI Chat */
export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  ts?: string
}

export type ChatMeta = {
  threadId: string
  messageId?: string
}

export async function postChat(input: { message: string; threadId?: string; userId?: string }) {
  return request<ChatMeta>("/v1/ai/chat", {
    method: "POST",
    body: JSON.stringify(input)
  })
}

export async function getChatHistory(params: { threadId: string }) {
  const url = `/v1/ai/history?threadId=${encodeURIComponent(params.threadId)}`
  return request<ChatMessage[]>(url)
}

/** Documents */
export type DocumentItem = {
  id: string
  title: string
  updatedAt: string
}

export async function listDocuments() {
  return request<DocumentItem[]>("/api/documents")
}

export async function createDocument(input: { title: string; content: string }) {
  return request<DocumentItem>("/api/documents", {
    method: "POST",
    body: JSON.stringify(input)
  })
}

/** Will builder */
export type WillProfile = {
  id: string
  status: "empty" | "in_progress" | "complete"
  answers?: Record<string, any>
}

export async function getWill() {
  return request<WillProfile>("/api/will")
}

export async function saveWill(input: { answers: Record<string, any> }) {
  return request<WillProfile>("/api/will", {
    method: "POST",
    body: JSON.stringify(input)
  })
}

/** Notary */
export type NotaryStatus = {
  enabled: boolean
  state: "idle" | "pending" | "completed" | "failed"
  lastRequestId?: string
}

export async function getNotaryStatus() {
  return request<NotaryStatus>("/api/notary/status")
}

export async function requestNotary(input: { docId: string }) {
  return request<{ requestId: string }>("/api/notary/request", {
    method: "POST",
    body: JSON.stringify(input)
  })
}

/** Compliance */
export type ComplianceItem = {
  key: string
  label: string
  status: "pass" | "fail" | "warn" | "na"
  details?: string
}

export async function getComplianceStatus() {
  return request<ComplianceItem[]>("/api/compliance/status")
}
