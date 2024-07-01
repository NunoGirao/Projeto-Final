import React, { useState, useEffect } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { FaShoppingCart, FaInfoCircle, FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MostrarEventos = ({ items, category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [followingPurchases, setFollowingPurchases] = useState({});
  const [visibleItems, setVisibleItems] = useState(5);
  const [showVerMais, setShowVerMais] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleItems(5);
      } else if (window.innerWidth >= 768) {
        setVisibleItems(3);
      } else {
        setVisibleItems(2);
      }
      setShowVerMais(window.innerWidth >= 769);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      if (!token) throw new Error('Token is missing');
      const response = await fetch(`http://localhost:5555/api/events/${eventId}/followings-purchases`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch following purchases');
      const data = await response.json();
      setFollowingPurchases((prevState) => ({ ...prevState, [eventId]: data }));
    } catch (error) {
      console.error('Error fetching following purchases:', error);
    }
  };

  const addToCart = async (eventId) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Token is missing');
      const response = await fetch('http://localhost:5555/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ eventId, quantity: 1 }),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      console.log('Added to cart:', await response.json());
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

  const generateUrl = (category) => {
    const specialCases = {
      "musica & festivais": "musicafestival",
    };
    let url = specialCases[category.toLowerCase()] || category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
    return url;
  };

  return (
    <div className="relative overflow-hidden mt-10 w-4/5 mx-auto">
      <div className="text-2xl text-white font-bold mb-3 flex items-center justify-between">
        <button
          className={`${barColor} flex items-center justify-between w-full`}
          onClick={() => navigate(`/${generateUrl(category)}`)}
          style={{ overflow: 'hidden' }}
        >
          <div className='ml-2 truncate' style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip' }}>
            {category}
          </div>
          {showVerMais && <div className='mr-2 hover:underline whitespace-nowrap'>Ver Mais</div>}
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
          {items.map((item, index) => (
            <div
              key={index}
              className="min-w-[20%] p-1"
              style={{ flex: `0 0 ${100 / visibleItems}%`, boxSizing: 'border-box' }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg group">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold mb-2 truncate">{item.name}</h3>
                    <div className="flex items-center mb-2">
                      <FaUserFriends className="mr-2" />
                      <div className="flex -space-x-2 overflow-hidden">
                        {followingPurchases[item._id]?.slice(0, 3).map((following) => (
                          <img
                            key={following._id}
                            src={following.profilePhoto}
                            alt={following.name}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                            title={following.name}
                          />
                        ))}
                        {followingPurchases[item._id]?.length > 3 && (
                          <span className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-gray-700 text-xs text-white">
                            +{followingPurchases[item._id].length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full text-sm flex items-center justify-center transition-colors duration-200"
                        onClick={(e) => { e.stopPropagation(); addToCart(item._id); }}
                      >
                        <FaShoppingCart className="mr-1" /> Comprar
                      </button>
                      <button
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-full text-sm flex items-center justify-center transition-colors duration-200"
                        onClick={(e) => { e.stopPropagation(); navigate(`/events/${item._id}`); }}
                      >
                        <FaInfoCircle className="mr-1" /> Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="truncate text-sm mt-2 text-center">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MostrarEventos;