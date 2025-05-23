'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    if (!paymentIntentId) {
      setStatus('error');
      return;
    }

    // Poll for payment status
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payment-status/${paymentIntentId}`);
        const data = await response.json();

        if (data.status === 'succeeded') {
          setStatus('success');
          // Here you would typically get the download URL from your backend
          setDownloadUrl(`/api/download-deck/${paymentIntentId}`);
        } else {
          // If payment is not yet succeeded, check again in 2 seconds
          setTimeout(checkPaymentStatus, 2000);
        }
      } catch (error) {
        setStatus('error');
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Processing your payment...</h1>
          <p>Please wait while we confirm your payment and prepare your deck.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Payment Error</h1>
          <p>There was an error processing your payment. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h1>
        <p className="mb-6">Your deck is ready for download.</p>
        {downloadUrl && (
          <a
            href={downloadUrl}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Download Your Deck
          </a>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we load your payment information.</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
} 