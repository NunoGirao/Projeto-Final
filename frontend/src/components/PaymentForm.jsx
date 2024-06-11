import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ amount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const createPaymentIntent = async () => {
      const amountInCents = amount * 100; // Convert to smallest currency unit
      if (amountInCents < 50) {
        setErrorMessage('Amount must be at least €0.50');
        return;
      }

      try {
        const response = await fetch('http://localhost:5555/api/payment/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: amountInCents }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setErrorMessage('Failed to create payment intent');
      }
    };

    createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!clientSecret) {
      setErrorMessage('Payment intent not created');
      return;
    }

    setIsProcessing(true); // Disable the button

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          address: {
            postal_code: postalCode,
          },
        },
      },
    });

    if (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message);
      setIsProcessing(false); // Re-enable the button in case of error
    } else {
      console.log('Payment successful:', paymentIntent);
      setErrorMessage('');
      setSuccessMessage('Payment successful!');
      
      // Call the purchaseCart API to finalize the purchase
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('http://localhost:5555/api/cart/purchase', {
          method: 'POST',
          headers: {
            'x-access-token': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to complete purchase');
        }

        onPaymentSuccess();
      } catch (error) {
        console.error('Error completing purchase:', error);
        setErrorMessage('Failed to complete purchase');
        setIsProcessing(false); // Re-enable the button in case of error
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">Complete Your Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <CardElement
            className="p-4 border border-gray-300 rounded-md w-full"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#32325d',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#fa755a',
                  iconColor: '#fa755a',
                },
              },
            }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
            Código Postal
          </label>
          <input
            type="text"
            id="postal-code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            placeholder="Ex: 1000-123"
          />
        </div>
        <button
          type="submit"
          disabled={!stripe || !clientSecret || isProcessing}
          className={`w-full py-3 px-6 rounded-md font-semibold transition duration-300 ${isProcessing ? 'bg-gray-500' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
        >
          {isProcessing ? 'Processing...' : `Pay €${amount}`}
        </button>
      </form>
      {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
      {successMessage && <div className="mt-4 text-green-500">{successMessage}</div>}
    </div>
  );
};

export default PaymentForm;
