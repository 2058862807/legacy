import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getToken, setToken, removeToken, authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        isAuthenticated: true, 
        user: action.payload,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        isLoading: false, 
        isAuthenticated: false, 
        user: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        error: null 
      };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true 
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      // For now, we'll assume token is valid and create a mock user
      // In production, you'd verify the token with the backend
      dispatch({
        type: 'SET_USER',
        payload: { email: 'user@example.com', name: 'User' }
      });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // For now, we'll simulate login since backend doesn't have JWT auth yet
      // In production, this would call authAPI.login(email, password)
      
      // Create/get user from backend
      const userData = await authAPI.register({ email, name: email.split('@')[0] });
      
      // Generate a mock JWT token (in production, backend would provide this)
      const mockToken = btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }));
      setToken(mockToken);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: userData
      });
      
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    removeToken();
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const newUser = await authAPI.register(userData);
      
      // Auto-login after registration
      const mockToken = btoa(JSON.stringify({ email: userData.email, exp: Date.now() + 86400000 }));
      setToken(mockToken);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: newUser
      });
      
      return newUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  };

  const value = {
    ...state,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};