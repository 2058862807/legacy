import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import {
  WelcomePage,
  LoginPage,
  RegisterPage,
  Dashboard,
  SmartWillBuilder,
  DocumentVault,
  DeathTriggerConfig,
  HeirManagement,
  ProfileSettings,
  GriefCompanion,
  BlockchainWallet,
  StateComplianceDashboard,
  Header,
  Footer,
  OnboardingChatbot
} from './components';

import {
  TermsOfServicePage,
  PrivacyPolicyPage,
  LiabilityAgreementPage
} from './legal-pages';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication
    const token = localStorage.getItem('nextera_token');
    const user = localStorage.getItem('nextera_user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    localStorage.setItem('nextera_token', userData.token);
    localStorage.setItem('nextera_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('nextera_token');
    localStorage.removeItem('nextera_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading NextEra Estate...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        {isAuthenticated && <Header user={currentUser} onLogout={handleLogout} />}
        
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <WelcomePage />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage onLogin={handleLogin} />
            } 
          />

          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? <Dashboard user={currentUser} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/will-builder" 
            element={
              isAuthenticated ? <SmartWillBuilder user={currentUser} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/vault" 
            element={
              isAuthenticated ? <DocumentVault user={currentUser} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/death-trigger" 
            element={
              isAuthenticated ? <DeathTriggerConfig user={currentUser} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/heirs" 
            element={
              isAuthenticated ? <HeirManagement user={currentUser} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/profile" 
            element={
              isAuthenticated ? <ProfileSettings user={currentUser} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/grief-companion" 
            element={
              isAuthenticated ? <GriefCompanion user={currentUser} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/blockchain" 
            element={
              isAuthenticated ? <BlockchainWallet user={currentUser} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/compliance" 
            element={
              isAuthenticated ? <StateComplianceDashboard user={currentUser} /> : <Navigate to="/login" />
            } 
          />
            
          {/* Legal Document Routes */}
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/liability" element={<LiabilityAgreementPage />} />
        </Routes>

        {!isAuthenticated && <Footer />}
        
        {/* Global Onboarding Chatbot - Available on all pages */}
        <OnboardingChatbot />
      </div>
    </Router>
  );
}

export default App;