import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa';

const ImageBalls = ({ balls, updateCartCount }) => {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [followingPurchases, setFollowingPurchases] = useState({});
  const navigate = useNavigate();

  const handleMouseEnter = (index) => {
    if (clickedIndex === -1) {
      setHoverIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (clickedIndex === -1) {
      setHoverIndex(-1);
    }
  };

  const handleClick = async (index) => {
    setClickedIndex(clickedIndex === index ? -1 : index);
    if (clickedIndex !== index) {
      await fetchFollowingPurchases(balls[index]._id);
    }
  };

  const fetchFollowingPurchases = async (eventId) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Token is missing');
      }
      const response = await fetch(`http://localhost:5555/api/events/${eventId}/followings-purchases`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch following purchases');
      }
      const data = await response.json();
      console.log('Fetched following purchases:', data);
      setFollowingPurchases(prevState => ({ ...prevState, [eventId]: data }));
    } catch (error) {
      console.error('Error fetching following purchases:', error);
    }
  };

  const addToCart = async (eventId) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Token is missing');
      }
      const response = await fetch('http://localhost:5555/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ eventId, quantity: 1 }),
      });
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      updateCartCount();
      const data = await response.json();
      console.log('Added to cart:', data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.ball')) {
        setClickedIndex(-1);
        setHoverIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    console.log('Balls data:', balls);
  }, [balls]);

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-full h-96 mx-auto bg-white">
        {balls.map((ball, index) => {
          const adjustedSize = hoverIndex === index || clickedIndex === index ? ball.size * 1.2 : ball.size;
          const fontSize = adjustedSize * 0.05;
          const buttonPadding = adjustedSize * 0.03;
          const iconSize = fontSize * 1.2; // Slightly larger than the font size

          return (
            <div
              key={index}
              className="ball absolute rounded-full bg-cover bg-center flex items-center justify-center"
              style={{
                backgroundImage: `url(${ball.image})`,
                width: `${adjustedSize}px`,
                height: `${adjustedSize}px`,
                left: `${ball.x}%`,
                top: `${ball.y}%`,
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.3s ease-in-out',
                overflow: 'hidden',
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(index)}
            >
              {clickedIndex === index && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center text-white p-3"
                  style={{
                    transition: 'opacity 0.3s ease-in-out',
                    opacity: clickedIndex === index ? 1 : 0,
                    fontSize: `${fontSize}px`,
                  }}
                >
                  <h2>{ball.name}</h2>
                  <div className="flex flex-wrap justify-center mb-2">
                    {followingPurchases[ball._id] && followingPurchases[ball._id].map(following => (
                      <img
                        key={following._id}
                        src={following.profilePhoto}
                        alt={following.name}
                        className="w-8 h-8 rounded-full border-2 border-white"
                        title={following.name}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                      style={{ padding: `${buttonPadding}px`, fontSize: `${fontSize}px` }}
                      onClick={(e) => { e.stopPropagation(); addToCart(ball._id); }}
                    >
                      <FaShoppingCart style={{ width: `${iconSize}px`, height: `${iconSize}px`, marginRight: '4px' }} />
                      Comprar
                    </button>
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                      style={{ padding: `${buttonPadding}px`, fontSize: `${fontSize}px` }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/events/${ball._id}`); }}
                    >
                      <FaInfoCircle style={{ width: `${iconSize}px`, height: `${iconSize}px`, marginRight: '4px' }} />
                      Mais Info
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageBalls;