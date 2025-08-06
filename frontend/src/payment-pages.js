// Payment Success and Cancel Pages for NextEra Estate
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Payment Success Page
export const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus();
    }
  }, [sessionId]);

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payments/status/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentDetails(data);
        setPaymentStatus(data.payment_status === 'paid' ? 'success' : 'pending');
      } else {
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error('Payment status check failed:', error);
      setPaymentStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            {paymentStatus === 'success' && (
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {paymentStatus === 'checking' && (
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            )}
            {paymentStatus === 'error' && (
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {paymentStatus === 'success' && 'Payment Successful!'}
            {paymentStatus === 'checking' && 'Confirming Payment...'}
            {paymentStatus === 'error' && 'Payment Verification Failed'}
            {paymentStatus === 'pending' && 'Payment Processing'}
          </h2>

          <p className="text-gray-600 mb-6">
            {paymentStatus === 'success' && 'Your payment has been processed successfully. Your premium features are now active.'}
            {paymentStatus === 'checking' && 'Please wait while we confirm your payment with our payment processor.'}
            {paymentStatus === 'error' && 'We encountered an issue verifying your payment. Please contact support if you believe this is an error.'}
            {paymentStatus === 'pending' && 'Your payment is being processed. This may take a few minutes.'}
          </p>
        </div>

        {paymentDetails && paymentStatus === 'success' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">${paymentDetails.amount_total || '29.99'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Currency:</span>
                <span className="font-medium">{paymentDetails.currency?.toUpperCase() || 'USD'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Paid</span>
              </div>
              {sessionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-mono">{sessionId.slice(0, 16)}...</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Continue to Dashboard
          </button>

          {paymentStatus === 'error' && (
            <button
              onClick={() => navigate('/contact')}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Contact Support
            </button>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@nexteraestate.com" className="text-blue-600 hover:text-blue-500">
              support@nexteraestate.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Payment Cancel Page
export const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
          
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges have been made to your account. You can try again whenever you're ready.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-gray-700 text-sm">
                Your account remains active with free features
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-gray-700 text-sm">
                You can upgrade to premium at any time
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-gray-700 text-sm">
                All your data and progress is saved
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Return to Dashboard
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Try Payment Again
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            Questions about pricing or features?
          </p>
          <div className="space-x-4">
            <a href="mailto:sales@nexteraestate.com" className="text-blue-600 hover:text-blue-500 text-sm">
              Contact Sales
            </a>
            <span className="text-gray-300">|</span>
            <a href="tel:1-800-378-2831" className="text-blue-600 hover:text-blue-500 text-sm">
              1-800-ESTATE1
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};