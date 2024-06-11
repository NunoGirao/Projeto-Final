import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';

const stripePromise = loadStripe('pk_test_51PQPXSRpFnjawKWoat63CmACG9z2GoHGm7KAPX4PY6YHjiHVUJheGLjrQYCfbDerLJ4nhMoti3yhSGf4z6uTk0Ja00JXruQAlj');

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('userToken'); // Ensure you retrieve the correct token
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5555/api/cart', {
          headers: {
            'x-access-token': token,
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await response.json();
        setCart(data.items || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleRemove = async (eventId) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5555/api/cart/remove', {
        method: 'POST',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove item from cart');
      }

      setCart(cart.filter(item => item.event._id !== eventId));
    } catch (error) {
      console.error('Error removing item from cart:', error); // Improved error logging
      alert(`Error removing item from cart: ${error.message}`);
    }
  };

  const handlePurchase = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    alert('Purchase successful!');
    setCart([]);
    setShowPaymentForm(false);
    navigate('/');
  };

  const handleQuantityChange = (eventId, quantity) => {
    setCart(cart.map(item =>
      item.event._id === eventId ? { ...item, quantity: parseInt(quantity) } : item
    ));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.event.price * item.quantity, 0);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-6 mt-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Your Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center text-lg">Your cart is empty</div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <ul className="divide-y divide-gray-200">
              {cart.map(item => (
                <li key={item.event._id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <img src={item.event.image} alt={item.event.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                    <div>
                      <h2 className="text-xl font-semibold">{item.event.name}</h2>
                      <p className="text-gray-500">{item.event.description}</p>
                      <p className="text-gray-700 font-bold">{formatCurrency(item.event.price)}</p>
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.event._id}`} className="mr-2">Quantity:</label>
                        <select
                          id={`quantity-${item.event._id}`}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.event._id, e.target.value)}
                          className="border border-gray-300 rounded-lg p-1"
                        >
                          {[...Array(10).keys()].map(num => (
                            <option key={num + 1} value={num + 1}>{num + 1}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => handleRemove(item.event._id)}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mt-6">
              <h2 className="text-2xl font-bold">Total: {formatCurrency(totalAmount)}</h2>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
                onClick={handlePurchase}
              >
                Proceder para o pagamento
              </button>
            </div>
          </div>
        )}
      </div>
      {showPaymentForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl mb-4">Complete your payment</h2>
            <Elements stripe={stripePromise}>
              <PaymentForm amount={totalAmount} onPaymentSuccess={handlePaymentSuccess} />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
