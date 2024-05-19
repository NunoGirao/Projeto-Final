import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handlePurchase = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5555/api/cart/purchase', {
        method: 'POST',
        headers: {
          'x-access-token': token,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to complete purchase');
      }

      alert('Purchase successful!');
      setCart([]);
      navigate('/');
    } catch (error) {
      console.error('Purchase failed:', error); // Improved error logging
      alert(`Purchase failed: ${error.message}`);
    }
  };

  const handleQuantityChange = (eventId, quantity) => {
    setCart(cart.map(item =>
      item.event._id === eventId ? { ...item, quantity: parseInt(quantity) } : item
    ));
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
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-6">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
                onClick={handlePurchase}
              >
                Purchase
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
