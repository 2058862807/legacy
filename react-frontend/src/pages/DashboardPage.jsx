import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, willAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  Plus, 
  Eye,
  Calendar,
  TrendingUp,
  Shield,
  Brain
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [userWills, setUserWills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    setError('');

    try {
      // Load dashboard stats
      const stats = await userAPI.getDashboardStats(user.email);
      setDashboardData(stats);

      // Load user's wills
      try {
        const wills = await willAPI.getByUser(user.email);
        setUserWills(Array.isArray(wills) ? wills : []);
      } catch (willError) {
        // If no wills found, that's okay
        setUserWills([]);
      }

    } catch (error) {
      console.error('Dashboard error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || user?.email?.split('@')[0]}
        </h1>
        <p className="text-gray-600">
          Manage your estate planning documents and monitor your progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Wills Created</p>
              <p className="text-3xl font-bold text-blue-600">
                {dashboardData?.wills_count || 0}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Documents</p>
              <p className="text-3xl font-bold text-green-600">
                {dashboardData?.documents_count || 0}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completion</p>
              <p className="text-3xl font-bold text-purple-600">
                {dashboardData?.completion_percentage || 0}%
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Last Activity</p>
              <p className="text-sm font-semibold text-orange-600">
                {dashboardData?.last_activity 
                  ? new Date(dashboardData.last_activity).toLocaleDateString()
                  : 'No activity'
                }
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/create-will"
                className="flex items-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Create New Will</h3>
                  <p className="text-sm text-gray-600">Start your estate planning journey</p>
                </div>
              </Link>

              <Link
                to="/ai-assistant"
                className="flex items-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Brain className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Ask AI Assistant</h3>
                  <p className="text-sm text-gray-600">Get legal guidance and advice</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Your Wills */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Wills</h2>
              <Link
                to="/create-will"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Create New
              </Link>
            </div>

            {userWills.length > 0 ? (
              <div className="space-y-4">
                {userWills.map((will) => (
                  <div key={will.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Will for {will.personal_info?.name || 'Unnamed'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(will.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Shield className="w-4 h-4 mr-1" />
                            {will.state}
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {will.completion_percentage}% Complete
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          will.completion_percentage >= 90 
                            ? 'bg-green-100 text-green-800'
                            : will.completion_percentage >= 70
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {will.completion_percentage >= 90 ? 'Complete' : 'In Progress'}
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Wills Created Yet</h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first will with our AI-powered platform
                </p>
                <Link
                  to="/create-will"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Will
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">AI Assistant</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Compliance Engine</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Blockchain Notary</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">Platform Enhancement</p>
                <p className="text-gray-600">New AI features added for better legal guidance</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Compliance Update</p>
                <p className="text-gray-600">Updated legal requirements for 5 states</p>
                <p className="text-xs text-gray-500 mt-1">1 week ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Security Enhancement</p>
                <p className="text-gray-600">Enhanced blockchain security protocols</p>
                <p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-700 text-sm mb-4">
              Our AI assistant is available 24/7 to answer your estate planning questions
            </p>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              <Brain className="w-4 h-4 mr-2" />
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;