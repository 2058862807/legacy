'use client'
import { useState } from 'react'

interface LegalDisclaimerProps {
  type?: 'ai' | 'will' | 'general' | 'notary'
  className?: string
}

export default function LegalDisclaimer({ type = 'general', className = '' }: LegalDisclaimerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const disclaimers = {
    ai: {
      title: "AI Legal Assistant Disclaimer",
      content: `⚖️ IMPORTANT LEGAL NOTICE: Esquire AI is an artificial intelligence assistant providing general information about estate planning. This is NOT legal advice and does not create an attorney-client relationship. 

• AI responses are informational only and should not replace consultation with a licensed attorney
• Laws vary by state and individual circumstances - professional legal advice is recommended
• NexteraEstate™ and its AI systems are not licensed to practice law
• For specific legal matters, consult with a qualified estate planning attorney in your jurisdiction

By using this AI assistant, you acknowledge these limitations and agree to seek professional legal counsel for your specific situation.`
    },
    will: {
      title: "Estate Planning Document Disclaimer", 
      content: `⚖️ LEGAL DISCLAIMER: Estate planning documents created through NexteraEstate™ are based on general legal principles and should be reviewed by a licensed attorney before execution.

• Documents may not be suitable for all situations or comply with all local requirements
• Complex estates may require additional legal instruments and professional guidance
• Proper execution, witnessing, and notarization requirements vary by state
• NexteraEstate™ does not provide legal advice or attorney services
• We recommend consultation with a qualified estate planning attorney

IMPORTANT: This platform provides document templates and guidance tools. It does not replace professional legal services or create an attorney-client relationship.`
    },
    notary: {
      title: "Blockchain Notarization Disclaimer",
      content: `🔗 BLOCKCHAIN NOTARIZATION NOTICE: Our blockchain notarization service creates an immutable timestamp and hash of your document for verification purposes.

• Blockchain notarization supplements but does not replace traditional notarization requirements
• Legal validity depends on local jurisdiction requirements for document execution
• Some documents may require traditional notary public services or legal witnesses
• Blockchain verification provides proof of document integrity and timestamp only
• Consult local requirements for document execution in your state

This service provides technical verification - not legal validation of document contents or execution.`
    },
    general: {
      title: "General Legal Disclaimer",
      content: `⚠️ LEGAL DISCLAIMER: NexteraEstate™ provides estate planning tools and information for educational purposes.

• We are not a law firm and do not provide legal advice or attorney services
• No attorney-client relationship is created by using our platform
• Information provided is general in nature and may not apply to your specific situation
• Laws vary by jurisdiction - consult with local legal professionals
• Documents and tools should be reviewed by qualified attorneys before use

Always seek professional legal advice for estate planning decisions. NexteraEstate™ is a technology platform providing tools and information only.`
    }
  }

  const disclaimer = disclaimers[type]

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
          <span className="text-yellow-600 text-lg">⚖️</span>
          <span className="font-semibold text-yellow-800">{disclaimer.title}</span>
        </div>
        <span className="text-yellow-600 text-xl">
          {isExpanded ? '−' : '+'}
        </span>
      </button>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-yellow-200">
          <div className="text-sm text-yellow-800 whitespace-pre-line leading-relaxed">
            {disclaimer.content}
          </div>
          <div className="mt-3 pt-2 border-t border-yellow-200 text-xs text-yellow-700">
            <strong>NexteraEstate™ Technology Platform</strong> - Not a law firm • Not legal advice • Consult attorneys for legal matters
          </div>
        </div>
      )}
    </div>
  )
}