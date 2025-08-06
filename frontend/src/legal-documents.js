// Legal Documents for NextEra Estate - Production Ready
import React, { useState } from 'react';

// Terms of Service Component
export const TermsOfService = ({ isModal = false, onClose = null }) => {
  const content = (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600">Effective Date: January 1, 2025 | Last Updated: January 6, 2025</p>
      </div>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using NextEra Estate ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
            If you do not agree to these Terms, do not use the Service. These Terms apply to all users, including visitors, 
            registered users, and premium subscribers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            NextEra Estate is a digital estate planning platform that provides:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>AI-powered will building and document generation tools</li>
            <li>Secure document storage with blockchain notarization capabilities</li>
            <li>50-state legal compliance checking and validation</li>
            <li>Digital asset management including cryptocurrency and NFT tracking</li>
            <li>AI grief companion and emotional support services</li>
            <li>Death trigger and automated estate activation systems</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. AI Services Disclaimer</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 font-semibold">⚠️ IMPORTANT: AI-Generated Content Limitations</p>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our AI services, including will building assistance and grief companion features, are provided for informational 
            and support purposes only. <strong>AI-generated content does not constitute legal, financial, or medical advice.</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>AI responses may contain errors, inaccuracies, or outdated information</li>
            <li>Legal requirements vary by jurisdiction and individual circumstances</li>
            <li>Professional consultation is strongly recommended for all legal matters</li>
            <li>We do not guarantee the accuracy, completeness, or reliability of AI-generated content</li>
            <li>AI grief support does not replace professional mental health services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Legal and Professional Services Disclaimer</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-semibold">🚨 NOT LEGAL ADVICE</p>
          </div>
          <p className="text-gray-700 leading-relaxed">
            <strong>NextEra Estate is not a law firm and does not provide legal advice.</strong> The Service provides 
            self-help tools and information. We cannot guarantee that our tools or information are appropriate for your 
            specific situation. You should consult with qualified attorneys, financial advisors, and tax professionals 
            for advice regarding your specific circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">5. User Responsibilities</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Users are responsible for:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Providing accurate and complete information</li>
            <li>Maintaining the confidentiality of account credentials</li>
            <li>Complying with applicable laws and regulations</li>
            <li>Regularly backing up important documents and data</li>
            <li>Seeking professional advice for complex legal matters</li>
            <li>Understanding that final estate planning documents require proper legal execution</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">6. Blockchain and Cryptocurrency Services</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our blockchain integration and cryptocurrency tracking features are provided "as is." Users acknowledge:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Blockchain transactions are irreversible and may incur network fees</li>
            <li>Cryptocurrency values are highly volatile and speculative</li>
            <li>We do not provide investment advice or recommendations</li>
            <li>Users are responsible for their own private keys and wallet security</li>
            <li>NFT and digital asset valuations are estimates and may not reflect market prices</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">7. Payment and Subscription Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Premium features require payment. By purchasing premium services:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Payments are processed securely through Stripe</li>
            <li>Subscription fees are billed in advance and non-refundable</li>
            <li>You may cancel at any time, but no refunds will be provided for partial periods</li>
            <li>Prices may change with 30 days' written notice</li>
            <li>Failure to pay may result in service suspension or termination</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">8. Prohibited Uses</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Users may not:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Use the Service for illegal purposes or to violate any laws</li>
            <li>Share account credentials or allow unauthorized access</li>
            <li>Attempt to reverse engineer, hack, or disrupt the Service</li>
            <li>Upload malicious code, viruses, or harmful content</li>
            <li>Impersonate others or provide false information</li>
            <li>Use the Service to generate spam or fraudulent documents</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">9. Data Security and Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement industry-standard security measures to protect your data, including AES-256 encryption and 
            secure transmission protocols. However, no system is completely secure. Users should review our Privacy 
            Policy for detailed information about data collection, use, and sharing practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">10. Service Availability</h2>
          <p className="text-gray-700 leading-relaxed">
            We strive to maintain high service availability but cannot guarantee uninterrupted access. The Service may 
            be temporarily unavailable due to maintenance, updates, or technical issues. We reserve the right to modify, 
            suspend, or discontinue any aspect of the Service at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">11. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">
            All content, software, and materials provided through the Service are owned by NextEra Estate or its licensors 
            and are protected by copyright, trademark, and other intellectual property laws. Users retain ownership of their 
            personal documents and data but grant us limited rights to provide the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">12. Termination</h2>
          <p className="text-gray-700 leading-relaxed">
            Either party may terminate this agreement at any time. Upon termination, your access to the Service will cease, 
            and you may lose access to your data. We recommend downloading important documents before termination. We may 
            retain certain data as required by law or for legitimate business purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">13. Limitation of Liability</h2>
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
            <p className="text-gray-800 font-semibold">IMPORTANT LIABILITY LIMITATIONS</p>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEXTERA ESTATE SHALL NOT BE LIABLE FOR:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Damages resulting from AI-generated content or advice</li>
            <li>Legal consequences of improperly executed estate planning documents</li>
            <li>Cryptocurrency losses or blockchain transaction failures</li>
            <li>Third-party services or integrations (Stripe, MetaMask, etc.)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            <strong>Our total liability shall not exceed the amount paid by you for the Service in the 12 months 
            preceding the claim.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">14. Indemnification</h2>
          <p className="text-gray-700 leading-relaxed">
            You agree to indemnify and hold NextEra Estate harmless from any claims, losses, or damages arising from 
            your use of the Service, violation of these Terms, or infringement of third-party rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">15. Governing Law and Dispute Resolution</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms are governed by the laws of Delaware, United States. Any disputes will be resolved through 
            binding arbitration in Delaware, except for injunctive relief which may be sought in court.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">16. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We may modify these Terms at any time by posting updated terms on our website. Continued use of the Service 
            after changes constitutes acceptance of the new Terms. Material changes will be communicated via email or 
            in-app notification.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
          <p className="text-gray-700 leading-relaxed">
            For questions about these Terms, please contact us at:
            <br />
            Email: legal@nexteraestate.com
            <br />
            Address: NextEra Estate, Legal Department, 123 Estate Lane, Wilmington, DE 19801
          </p>
        </section>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <p className="text-blue-800 font-semibold mb-2">Important Reminder:</p>
          <p className="text-blue-700">
            Estate planning is a complex legal matter with significant consequences. While our Service provides helpful 
            tools and information, it cannot replace professional legal advice. We strongly recommend consulting with 
            qualified attorneys and financial advisors for your estate planning needs.
          </p>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Terms of Service</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};

// Privacy Policy Component
export const PrivacyPolicy = ({ isModal = false, onClose = null }) => {
  const content = (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Effective Date: January 1, 2025 | Last Updated: January 6, 2025</p>
      </div>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            NextEra Estate ("we," "our," or "us") respects your privacy and is committed to protecting your personal 
            information. This Privacy Policy explains how we collect, use, share, and safeguard your information when 
            you use our estate planning platform and related services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>Name, email address, phone number, and mailing address</li>
            <li>Date of birth and jurisdiction information</li>
            <li>Financial information related to estate planning</li>
            <li>Beneficiary and heir information</li>
            <li>Authentication credentials and security preferences</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Estate Planning Documents</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>Wills, trusts, and other legal documents</li>
            <li>Digital asset information including cryptocurrency addresses</li>
            <li>Important personal documents and media files</li>
            <li>Asset inventories and valuations</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3 AI Interaction Data</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>Conversations with our AI grief companion</li>
            <li>Queries and responses from AI will-building assistance</li>
            <li>Emotional state indicators and support session data</li>
            <li>Usage patterns and preferences for AI services</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">2.4 Technical Information</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>IP addresses, browser types, and device information</li>
            <li>Usage analytics, page views, and feature interactions</li>
            <li>Blockchain wallet addresses and transaction hashes</li>
            <li>Performance data and error logs</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Service Provision</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>Generate and customize estate planning documents</li>
            <li>Provide AI-powered assistance and guidance</li>
            <li>Enable blockchain notarization and verification</li>
            <li>Facilitate secure document storage and sharing</li>
            <li>Process payments and manage subscriptions</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 AI Services</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>Train and improve AI models for better assistance</li>
            <li>Provide personalized responses and recommendations</li>
            <li>Detect crisis situations and provide appropriate support</li>
            <li>Ensure compliance with state-specific legal requirements</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 Communication and Support</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Send service notifications and updates</li>
            <li>Provide customer support and technical assistance</li>
            <li>Communicate important legal or policy changes</li>
            <li>Send promotional materials (with your consent)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 AI Providers</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use third-party AI services including OpenAI and DeepSeek to provide intelligent assistance. These 
            services may process your conversations and queries to generate responses. We have agreements in place 
            to protect your data, but you should review their privacy policies:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>OpenAI Privacy Policy: https://openai.com/privacy/</li>
            <li>DeepSeek Privacy Policy: https://deepseek.com/privacy</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Payment Processing</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use Stripe for secure payment processing. Stripe handles your payment information according to their 
            privacy policy and PCI DSS standards. We do not store complete credit card information on our servers.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 Blockchain Services</h3>
          <p className="text-gray-700 leading-relaxed">
            When you use blockchain features, transaction information becomes permanently recorded on public blockchain 
            networks. This information cannot be deleted or modified once recorded.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">5. Data Security</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 font-semibold">🔒 Industry-Leading Security Measures</p>
          </div>
          
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>AES-256 Encryption:</strong> All sensitive data is encrypted at rest and in transit</li>
            <li><strong>Multi-Factor Authentication:</strong> Additional security layers for account access</li>
            <li><strong>Regular Security Audits:</strong> Ongoing assessment of our security infrastructure</li>
            <li><strong>Access Controls:</strong> Strict limitations on who can access your data</li>
            <li><strong>Backup and Recovery:</strong> Secure, encrypted backups with geographic distribution</li>
            <li><strong>Incident Response Plan:</strong> Procedures for handling potential security breaches</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">6.1 Access and Correction</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You have the right to access, correct, or update your personal information at any time through your 
            account settings or by contacting us.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">6.2 Data Deletion</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You may request deletion of your account and associated data. Note that some information may be retained 
            for legal compliance or legitimate business purposes.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">6.3 Communication Preferences</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You can opt out of promotional communications while continuing to receive important service notifications.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">6.4 GDPR and CCPA Rights</h3>
          <p className="text-gray-700 leading-relaxed">
            If you are in the EU or California, you have additional rights under GDPR and CCPA, including the right 
            to data portability, restriction of processing, and more detailed information about our data practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">7. International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
            safeguards are in place to protect your data during international transfers, including Standard Contractual 
            Clauses and adequacy decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Our Service is not intended for individuals under 18 years of age. We do not knowingly collect personal 
            information from children. If we discover we have collected information from a child, we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy periodically. We will notify you of significant changes via email or 
            prominent notice in our Service. Your continued use constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            For privacy-related questions or requests, please contact us at:
            <br />
            Email: privacy@nexteraestate.com
            <br />
            Address: NextEra Estate, Privacy Officer, 123 Estate Lane, Wilmington, DE 19801
            <br />
            Phone: 1-800-ESTATE1 (1-800-378-2831)
          </p>
        </section>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <p className="text-blue-800 font-semibold mb-2">Your Privacy Matters:</p>
          <p className="text-blue-700">
            We are committed to transparency and protecting your sensitive estate planning information. If you have 
            any questions about our privacy practices, please don't hesitate to contact us.
          </p>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Privacy Policy</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};

// Liability Agreement Component
export const LiabilityAgreement = ({ isModal = false, onClose = null }) => {
  const content = (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Liability Agreement & Disclaimers</h1>
        <p className="text-gray-600">Effective Date: January 1, 2025 | Last Updated: January 6, 2025</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <svg className="w-8 h-8 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h2 className="text-xl font-bold text-red-800">IMPORTANT LEGAL NOTICE</h2>
        </div>
        <p className="text-red-700 font-medium">
          Please read this Liability Agreement carefully. By using NextEra Estate, you acknowledge and accept 
          the limitations and disclaimers outlined below.
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. AI Services Liability Disclaimer</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 font-semibold">⚠️ AI-Generated Content Limitations</p>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>NextEra Estate's AI services, including but not limited to will-building assistance and grief 
            companion features, are provided for informational purposes only and should not be relied upon as 
            professional advice.</strong>
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">1.1 AI Accuracy Disclaimer</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>AI responses may contain errors, inaccuracies, or outdated information</li>
            <li>AI models may misinterpret user input or provide inappropriate responses</li>
            <li>Legal and jurisdictional information may not reflect current law</li>
            <li>AI-generated documents require professional review before execution</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">1.2 Grief Companion Disclaimer</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>AI grief support is not a substitute for professional mental health treatment</li>
            <li>Crisis detection may not be reliable in all situations</li>
            <li>Users experiencing mental health emergencies should contact professional services immediately</li>
            <li>Emotional support provided is algorithmic and not from licensed professionals</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Legal Services Disclaimer</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-semibold">🚨 NOT LEGAL ADVICE - NOT A LAW FIRM</p>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>NextEra Estate is not a law firm, does not employ attorneys to provide services to users, 
            and does not provide legal advice.</strong> Any information provided through our Service is for 
            educational and informational purposes only.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Estate Planning Disclaimer</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>Estate planning requirements vary significantly by jurisdiction</li>
            <li>Generated documents may not be legally valid without proper execution</li>
            <li>Complex estates may require specialized legal assistance</li>
            <li>Tax implications are not addressed by our Service</li>
            <li>Users are responsible for ensuring documents comply with local laws</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Professional Consultation Required</h3>
          <p className="text-gray-700 leading-relaxed">
            <strong>We strongly recommend consulting with qualified attorneys, financial advisors, tax professionals, 
            and other experts before executing any estate planning documents or making significant financial decisions 
            based on information from our Service.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Financial and Investment Disclaimers</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Cryptocurrency and Digital Assets</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li><strong>High Risk:</strong> Cryptocurrency investments are extremely volatile and speculative</li>
            <li><strong>Total Loss Possible:</strong> Digital assets can lose all value</li>
            <li><strong>No Investment Advice:</strong> We do not recommend specific investments</li>
            <li><strong>Regulatory Risk:</strong> Cryptocurrency regulations are evolving and uncertain</li>
            <li><strong>Security Risk:</strong> Users are responsible for wallet security and private keys</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Asset Valuation Disclaimer</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Asset valuations provided by our Service are estimates only and may not reflect current market values. 
            We do not guarantee the accuracy of any valuation information.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 NFT and Digital Collectibles</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>NFT values are highly speculative and can become worthless</li>
            <li>Ownership rights may be limited or unclear</li>
            <li>Technology risks include platform failures or changes</li>
            <li>Copyright and intellectual property issues may arise</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Technology and Security Limitations</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 System Availability</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>Service may be unavailable due to maintenance, updates, or technical issues</li>
            <li>Data loss is possible despite backup systems</li>
            <li>Internet connectivity issues may prevent access</li>
            <li>Third-party service failures may impact functionality</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Security Risks</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>No system is completely secure from unauthorized access</li>
            <li>Users are responsible for account security and strong passwords</li>
            <li>Phishing and social engineering attacks are possible</li>
            <li>Blockchain transactions are irreversible once confirmed</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 Third-Party Services</h3>
          <p className="text-gray-700 leading-relaxed">
            Our Service integrates with third-party providers including Stripe, OpenAI, MetaMask, and blockchain 
            networks. We are not responsible for the performance, security, or policies of these external services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
          
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
            <p className="text-gray-800 font-semibold">MAXIMUM LIABILITY LIMITATION</p>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, NEXTERA ESTATE'S TOTAL LIABILITY TO YOU 
            FOR ANY AND ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE GREATER OF:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>$100 USD, or</li>
            <li>The total amount you paid to NextEra Estate in the 12 months preceding the claim</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Excluded Damages</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>WE SHALL NOT BE LIABLE FOR:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, or business opportunities</li>
            <li>Loss or corruption of data, including estate planning documents</li>
            <li>Legal consequences of improperly executed estate planning documents</li>
            <li>Financial losses from cryptocurrency or investment decisions</li>
            <li>Emotional distress or mental anguish</li>
            <li>Third-party claims or actions</li>
            <li>Failure to prevent or detect crisis situations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">6. Assumption of Risk</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>By using NextEra Estate, you acknowledge and assume the following risks:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Estate planning is complex and consequences of errors can be severe</li>
            <li>AI-generated advice may be inaccurate or inappropriate for your situation</li>
            <li>Technology failures could result in loss of important information</li>
            <li>Cryptocurrency and digital assets carry significant financial risks</li>
            <li>Legal requirements change and our information may become outdated</li>
            <li>Professional review is necessary for important legal documents</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">7. User Responsibilities</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Users are solely responsible for:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Verifying the accuracy and appropriateness of all information and documents</li>
            <li>Consulting with qualified professionals before making important decisions</li>
            <li>Ensuring proper execution of legal documents according to applicable law</li>
            <li>Maintaining backups of important information and documents</li>
            <li>Securing account credentials and wallet private keys</li>
            <li>Understanding the risks associated with cryptocurrency investments</li>
            <li>Seeking professional help for mental health concerns</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">8. Severability</h2>
          <p className="text-gray-700 leading-relaxed">
            If any provision of this Liability Agreement is found to be unenforceable, the remaining provisions 
            shall remain in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">9. Acknowledgment</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>BY USING NEXTERA ESTATE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND 
            BY THIS LIABILITY AGREEMENT AND ALL DISCLAIMERS CONTAINED HEREIN.</strong>
          </p>
        </section>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
          <p className="text-red-800 font-semibold mb-4">Critical Reminders:</p>
          <ul className="text-red-700 space-y-2">
            <li>• Estate planning has significant legal and financial consequences</li>
            <li>• Professional legal advice is strongly recommended</li>
            <li>• AI responses should not be relied upon as professional advice</li>
            <li>• Users assume all risks associated with using the Service</li>
            <li>• Our liability is strictly limited as outlined above</li>
          </ul>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Liability Agreement</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};

// Legal Agreement Modal with Required Acceptance
export const LegalAgreementModal = ({ isOpen, onAccept, onDecline }) => {
  const [currentTab, setCurrentTab] = useState('terms');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedLiability, setAcceptedLiability] = useState(false);

  const allAccepted = acceptedTerms && acceptedPrivacy && acceptedLiability;

  const handleAccept = () => {
    if (allAccepted) {
      onAccept();
    }
  };

  const handleDecline = () => {
    // Reset acceptance states when declining
    setAcceptedTerms(false);
    setAcceptedPrivacy(false);
    setAcceptedLiability(false);
    setCurrentTab('terms');
    onDecline();
  };

  const handleBackgroundClick = (e) => {
    // Allow closing by clicking outside the modal
    if (e.target === e.currentTarget) {
      handleDecline();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-xl max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header with Close Button */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 relative">
          <button
            onClick={handleDecline}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Legal Agreements Required</h2>
          <p className="text-gray-600">
            Please accept our legal agreements to continue. You can review the full documents using the tabs below if needed.
          </p>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>📋 Quick Summary:</strong> By agreeing, you acknowledge our terms of service, privacy practices, and liability limitations. 
              Full legal documents are available for review in the tabs below.
            </p>
          </div>
        </div>

        {/* Quick Agreement Section - Make this prominent */}
        <div className="bg-white border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Agreements</h3>
          <div className="space-y-3">
            <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  I accept the <strong>Terms of Service</strong>
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Governs your use of NextEra Estate services and platform features
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  I accept the <strong>Privacy Policy</strong>
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Describes how we collect, use, and protect your personal information
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={acceptedLiability}
                onChange={(e) => setAcceptedLiability(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  I understand the <strong>Liability Agreement</strong>
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Important limitations and disclaimers regarding our AI and legal services
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons - More prominent */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel Registration
            </button>
            <button
              onClick={handleAccept}
              disabled={!allAccepted}
              className={`px-8 py-3 rounded-lg font-semibold text-sm ${
                allAccepted
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-all`}
            >
              {allAccepted ? '✓ Accept All & Create Account' : 'Please Accept All Agreements'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setCurrentTab('terms')}
              className={`px-6 py-3 text-sm font-medium ${
                currentTab === 'terms'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Terms of Service {acceptedTerms && <span className="text-green-600">✓</span>}
            </button>
            <button
              onClick={() => setCurrentTab('privacy')}
              className={`px-6 py-3 text-sm font-medium ${
                currentTab === 'privacy'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Privacy Policy {acceptedPrivacy && <span className="text-green-600">✓</span>}
            </button>
            <button
              onClick={() => setCurrentTab('liability')}
              className={`px-6 py-3 text-sm font-medium ${
                currentTab === 'liability'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Liability Agreement {acceptedLiability && <span className="text-green-600">✓</span>}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {currentTab === 'terms' && <TermsOfService />}
          {currentTab === 'privacy' && <PrivacyPolicy />}
          {currentTab === 'liability' && <LiabilityAgreement />}
        </div>

        {/* Acceptance Checkboxes */}
        <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-4">
          <div className="space-y-3">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the <strong>Terms of Service</strong>
              </span>
            </label>

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the <strong>Privacy Policy</strong>
              </span>
            </label>

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={acceptedLiability}
                onChange={(e) => setAcceptedLiability(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I have read and understand the <strong>Liability Agreement and Disclaimers</strong>
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={handleDecline}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Decline & Exit Registration
            </button>
            <button
              onClick={handleAccept}
              disabled={!allAccepted}
              className={`px-6 py-2 rounded-lg font-medium ${
                allAccepted
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Accept All & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};