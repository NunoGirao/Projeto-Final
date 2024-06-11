import React, { useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const MostrarEventos = ({ items, category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [followingPurchases, setFollowingPurchases] = useState({});
  const visibleItems = 5;
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - visibleItems ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleMouseEnter = async (index) => {
    setHoverIndex(index);
    await fetchFollowingPurchases(items[index]._id);
  };

  const handleMouseLeave = () => {
    setHoverIndex(-1);
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
      setFollowingPurchases((prevState) => ({ ...prevState, [eventId]: data }));
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

      const data = await response.json();
      console.log('Added to cart:', data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const getBarColor = (category) => {
    switch (category) {
      case "Teatro & Arte":
      case "Teatro":
      case "Museus & Exposições":
      case "Dança":
        return "bg-red-400";
      case "Música & Festivais":
      case "Concertos":
      case "Festivais":
      case "Música Clássica":
      case "Fado":
        return "bg-blue-700";
      case "Família":
      case "Teatros & Espetáculos":
      case "Parques Temáticos":
      case "Cinema":
        return "bg-yellow-700";
      case "Desporto & Aventura":
      case "Corridas":
      case "Lazer":
        return "bg-red-700";
      default:
        return "bg-black";
    }
  };

  const barColor = getBarColor(category);

  return (
    <div className="relative overflow-hidden mt-10 w-4/5 mx-auto">
      <div className="text-2xl text-white font-bold mb-3 flex items-center justify-between">
        <button className={`${barColor} flex justify-between`} style={{ width: '100%' }} onClick={() => navigate(`/${category.toLowerCase().replace(/ /g, '')}`)}>
          <div className='ml-2'>{category}</div>
          <div className='mr-2 hover:underline'>Ver Mais</div>
        </button>
        <div className="flex items-center">
          <button onClick={handlePrev} className={`${barColor} text-white mr-4 ml-2`} style={{ height: '32px' }}>
            <BsChevronCompactLeft className="text-3xl" />
          </button>
          {currentIndex < items.length && (
            <button onClick={handleNext} className={`${barColor} text-white mr-2`} style={{ height: '32px' }}>
              <BsChevronCompactRight className="text-3xl" />
            </button>
          )}
        </div>
        <div className={barColor} style={{ width: '100px', height: '32px' }}></div>
      </div>

      <div className="flex overflow-hidden relative" style={{ width: '100%' }}>
        <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`, width: '100%' }}>
          {items.map((item, index) => {
            const isHovered = hoverIndex === index;
            return (
              <div
                key={index}
                className="min-w-[20%] p-1"
                style={{ flex: `0 0 ${100 / visibleItems}%`, boxSizing: 'border-box' }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="shadow-lg overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-auto object-cover" style={{ height: '200px' }} />
                  <p className="truncate text-sm p-2 text-center">{item.name}</p>
                  {isHovered && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center text-white p-3"
                      style={{
                        transition: 'opacity 0.3s ease-in-out',
                        opacity: isHovered ? 1 : 0,
                      }}
                    >
                      <h2>{item.name}</h2>
                      <div className="flex flex-wrap justify-center mb-2">
                        {followingPurchases[item._id] && followingPurchases[item._id].map((following) => (
                          <img
                            key={following._id}
                            src={following.profilePhoto}
                            alt={following.name}
                            className="w-8 h-8 rounded-full border-2 border-white m-1"
                            title={following.name}
                          />
                        ))}
                      </div>
                      <div>
                        <button
                          className="bg-green-500 text-white m-1 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item._id);
                          }}
                        >
                          Comprar
                        </button>
                        <button
                          className="bg-orange-500 text-white m-1 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/events/${item._id}`);
                          }}
                        >
                          Mais Info
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MostrarEventos;
