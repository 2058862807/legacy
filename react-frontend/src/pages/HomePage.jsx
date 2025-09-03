import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Brain, 
  Shield, 
  Link as LinkIcon, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  Award
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'AI Legal Intelligence',
      description: 'AutoLex Core provides triple-verified legal guidance with source citations and 95% confidence scoring.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: '50-State Compliance',
      description: 'Automatic validation of legal requirements across all US jurisdictions with real-time compliance checking.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: LinkIcon,
      title: 'Blockchain Security',
      description: 'Gasless blockchain notarization provides immutable document security without crypto complexity.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Clock,
      title: 'Live Estate Monitoring',
      description: 'AI monitors life changes and automatically suggests will updates to keep your estate plan current.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const stats = [
    { number: '50+', label: 'States Covered' },
    { number: '95%', label: 'AI Confidence' },
    { number: '<2min', label: 'Will Creation' },
    { number: '100%', label: 'Blockchain Secured' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              AI-Powered
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Estate Planning
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Create legally compliant wills with blockchain security, AI guidance, and 50-state compliance automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? "/create-will" : "/register"}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Create Your Will Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/ai-assistant"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                <Brain className="mr-2 w-5 h-5" />
                Talk to AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose NexteraEstate?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another legal document service. Our platform combines cutting-edge AI, 
              blockchain technology, and comprehensive legal compliance to revolutionize estate planning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} rounded-lg mb-6`}>
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Competitive Advantage Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Beyond Traditional Legal Services
            </h2>
            <p className="text-xl text-gray-600">
              See how NexteraEstate compares to traditional estate planning solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border-2 border-gray-200 rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Traditional Lawyers</h3>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• $3,000-$5,000+ cost</li>
                <li>• Weeks to months timeline</li>
                <li>• Limited availability</li>
                <li>• No ongoing monitoring</li>
                <li>• Manual compliance checking</li>
              </ul>
            </div>

            <div className="text-center p-8 border-2 border-gray-200 rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Online Templates</h3>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>• $50-$200 cost</li>
                <li>• Generic templates</li>
                <li>• No legal guidance</li>
                <li>• No compliance checking</li>
                <li>• No blockchain security</li>
              </ul>
            </div>

            <div className="text-center p-8 border-2 border-blue-200 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">NexteraEstate</h3>
              <ul className="text-blue-800 space-y-2 text-left">
                <li>• <CheckCircle className="inline w-4 h-4 mr-1" /> $29-$99/month</li>
                <li>• <CheckCircle className="inline w-4 h-4 mr-1" /> AI legal guidance</li>
                <li>• <CheckCircle className="inline w-4 h-4 mr-1" /> 50-state compliance</li>
                <li>• <CheckCircle className="inline w-4 h-4 mr-1" /> Live monitoring</li>
                <li>• <CheckCircle className="inline w-4 h-4 mr-1" /> Blockchain security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Secure Your Legacy?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands who trust NexteraEstate for their estate planning needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? "/create-will" : "/register"}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Brain className="mr-2 w-5 h-5" />
              Ask AI Questions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;