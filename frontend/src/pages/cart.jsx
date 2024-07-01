import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import { motion, AnimatePresence } from 'framer-motion';

const stripePromise = loadStripe('pk_test_51PQPXSRpFnjawKWoat63CmACG9z2GoHGm7KAPX4PY6YHjiHVUJheGLjrQYCfbDerLJ4nhMoti3yhSGf4z6uTk0Ja00JXruQAlj');

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('userToken');
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
          throw new Error('Falha ao buscar o carrinho');
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
        throw new Error(data.message || 'Falha ao remover item do carrinho');
      }

      setCart(cart.filter(item => item.event._id !== eventId));
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      alert(`Erro ao remover item do carrinho: ${error.message}`);
    }
  };

  const handlePurchase = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    alert('Compra realizada com sucesso!');
    setCart([]);
    setShowPaymentForm(false);
    navigate('/');
  };

  const handleQuantityChange = (eventId, change) => {
    setCart(cart.map(item =>
      item.event._id === eventId
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.event.price * item.quantity, 0);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">O Seu Carrinho de Compras</h1>
        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center bg-gray-50 rounded-xl p-12 shadow-sm"
          >
            <svg className="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-xl text-gray-600 mb-6">O seu carrinho está vazio</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition duration-300 shadow-md inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continuar a Comprar
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ul className="divide-y divide-gray-200">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.li 
                    key={item.event._id} 
                    className="py-6 flex flex-col sm:flex-row sm:items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                      <img src={item.event.image} alt={item.event.name} className="w-full h-full object-center object-cover" />
                    </div>
                    <div className="flex-1 ml-6">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{item.event.name}</h3>
                        <p className="ml-4 text-lg font-medium text-gray-900">{formatCurrency(item.event.price)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.event.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.event._id, -1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition duration-300"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.event._id, 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition duration-300"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item.event._id)}
                          className="text-red-500 hover:text-red-600 transition duration-300"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="mt-10 border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Total</h2>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">Impostos e custos de envio calculados no checkout</p>
              <div className="mt-6">
                <button
                  onClick={handlePurchase}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition duration-300 shadow-md flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Finalizar Compra
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {showPaymentForm && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-8 rounded-lg max-w-md w-full"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Concluir o Pagamento</h2>
              <Elements stripe={stripePromise}>
                <PaymentForm amount={totalAmount} onPaymentSuccess={handlePaymentSuccess} />
              </Elements>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-md transition duration-300"
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;