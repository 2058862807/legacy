import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { aiAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Send, 
  Bot, 
  User, 
  Brain, 
  MessageCircle, 
  HelpCircle,
  Scale,
  Shield,
  Users
} from 'lucide-react';

const AIAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: "Hello! I'm AutoLex Core, your AI legal assistant. I can help you with estate planning questions, state compliance requirements, and legal guidance. What would you like to know?",
      timestamp: new Date(),
      confidence: 0.95
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipient, setRecipient] = useState('autolex');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiAPI.communicate(messageToSend, recipient, 'normal');
      
      // Extract AI response
      let aiResponse = 'I apologize, but I encountered an issue processing your request.';
      let confidence = 0;
      
      if (response.responses) {
        // Try to get response from the selected recipient first
        if (response.responses[recipient] || response.responses[`${recipient}_core`]) {
          const agentResponse = response.responses[recipient] || response.responses[`${recipient}_core`];
          aiResponse = agentResponse.response || aiResponse;
          confidence = agentResponse.confidence || 0;
        } else {
          // Fallback to any available response
          const firstResponse = Object.values(response.responses)[0];
          if (firstResponse) {
            aiResponse = firstResponse.response || aiResponse;
            confidence = firstResponse.confidence || 0;
          }
        }
      }

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        confidence: confidence,
        communicationId: response.communication_id
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI communication error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        content: `I apologize, but I encountered an error: ${error.message}. Please try again or rephrase your question.`,
        timestamp: new Date(),
        confidence: 0,
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const askPredefinedQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => sendMessage(), 100);
  };

  const predefinedQuestions = [
    {
      category: 'State Requirements',
      icon: Scale,
      questions: [
        'What are the requirements for a valid will in California?',
        'Do I need witnesses for my will?',
        'What makes a will legally binding?'
      ]
    },
    {
      category: 'Beneficiaries',
      icon: Users,
      questions: [
        'How do I choose beneficiaries for my will?',
        'Can I leave assets to a charity?',
        'What happens if a beneficiary dies before me?'
      ]
    },
    {
      category: 'Legal Guidance',
      icon: Shield,
      questions: [
        'What is a living will vs a regular will?',
        'Do I need a lawyer to create a will?',
        'How often should I update my will?'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">AI Legal Assistant</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get instant answers to your estate planning questions from AutoLex Core, 
          our AI system with triple-verified legal intelligence and 95% confidence scoring.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg flex flex-col h-96">
            {/* Chat Header */}
            <div className="p-4 border-b bg-blue-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">AutoLex Core</h3>
                    <p className="text-sm text-gray-600">AI Legal Intelligence System</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="autolex">AutoLex Core</option>
                    <option value="senior_manager">Senior AI Manager</option>
                    <option value="team">Full AI Team</option>
                  </select>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.isError
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start">
                      {message.sender === 'ai' && (
                        <Bot className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                          <span>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {message.confidence !== undefined && message.sender === 'ai' && (
                            <span className="ml-2">
                              Confidence: {Math.round(message.confidence * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex items-center">
                      <Bot className="w-4 h-4 mr-2" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about estate planning, legal requirements, or any legal question..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows="2"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed self-end"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Quick Questions
            </h3>
            <div className="space-y-4">
              {predefinedQuestions.map((category, categoryIndex) => {
                const IconComponent = category.icon;
                return (
                  <div key={categoryIndex}>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center text-sm">
                      <IconComponent className="w-4 h-4 mr-2 text-blue-600" />
                      {category.category}
                    </h4>
                    <div className="space-y-2">
                      {category.questions.map((question, questionIndex) => (
                        <button
                          key={questionIndex}
                          onClick={() => askPredefinedQuestion(question)}
                          className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Capabilities */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">AI Capabilities</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-blue-800">50-state legal compliance</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-blue-800">Triple-verified responses</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-blue-800">95% confidence scoring</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-blue-800">Source citations</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-blue-800">Real-time legal updates</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Disclaimer:</strong> This AI assistant provides general legal information 
              and should not be considered as professional legal advice. For complex legal matters, 
              please consult with a qualified attorney.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;