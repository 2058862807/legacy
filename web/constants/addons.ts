export type Addon = {
  name: string
  description: string
  monthly?: number
  link?: string
  enabled: boolean
}

export const UNIVERSAL_ADDONS: Addon[] = [
  { name: "AI Assistant", description: "Chat with your documents and plans", monthly: 19, enabled: true },
  { name: "Secure Notary", description: "Remote online notarization workflow", monthly: 9, enabled: true },
  { name: "Compliance Pack", description: "HIPAA, GDPR, and SOC reporting", monthly: 29, enabled: false }
]