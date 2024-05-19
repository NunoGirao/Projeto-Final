import React, { useState, useEffect } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import NavBar from "../components/navbar";
import MostrarEventos from '../components/mostrareventos';
import ImageBalls from "../components/bolas";

const Home = () => {
  const [topEvents, setTopEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchTopEvents = async () => {
      try {
        const response = await fetch('http://localhost:5555/api/events/top-events'); // Correct endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch top events');
        }
        const data = await response.json();
        setTopEvents(data);
      } catch (error) {
        console.error("Error fetching top events:", error);
      }
    };
  
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5555/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchTopEvents();
    fetchEvents();
    updateCartCount();
  }, []);
  

  const updateCartCount = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch('http://localhost:5555/api/cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.items.length);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    }
  };

  const slides = [
    "https://i.redd.it/u8bydp4wtiz91.png",
    "https://images7.alphacoders.com/587/587593.png",
    "https://images.gamebanana.com/img/ss/mods/52107ac3349f6.jpg",
  ];

  const positions = [
    { size: 250, x: 50, y: 50 }, // Bola central
    { size: 150, x: 70, y: 30 },
    { size: 150, x: 35, y: 70 },
    { size: 150, x: 10, y: 50 },
    { size: 150, x: 25, y: 30 },
    { size: 150, x: 80, y: 80 },
    { size: 150, x: 90, y: 50 },
    { size: 100, x: 65, y: 75 },
    { size: 100, x: 20, y: 80 },
    { size: 100, x: 80, y: 20 },
    { size: 100, x: 38, y: 20 },
  ];

  const balls = topEvents.slice(0, positions.length).map((event, index) => ({
    ...event,
    ...positions[index]
  }));

  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slideStyles = {
    width: "100%",
    height: "100%",
    transition: "transform 0.5s ease-in-out",
    position: "absolute",
    top: 0,
    left: 0,
  };

  const getSlideStyle = (index) => ({
    width: "100%",
    height: "100%",
    transition: "transform 0.5s ease-in-out",
    position: "absolute",
    top: 0,
    left: 0,
    transform: index === current ? "translateX(0)" : index < current ? "translateX(-100%)" : "translateX(100%)",
    opacity: index === current ? 1 : 1,
  });

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null; // return null if no slides
  }

  const filterEventsByCategory = (category) => {
    return events.filter(event => event.category === category);
  };

  return (
    <div>
      <NavBar cartCount={cartCount} />
      <div>
        <div className="relative overflow-hidden mt-12" style={{ height: "400px" }}>
          <BsChevronCompactLeft
            onClick={prevSlide}
            className="absolute left-0 text-white text-3xl cursor-pointer z-10 bg-black bg-opacity-20 rounded-r-lg"
            style={{ height: "400px", width: "50px" }}
          />
          <BsChevronCompactRight
            onClick={nextSlide}
            className="absolute right-0 text-white text-3xl cursor-pointer z-10 bg-black bg-opacity-20 rounded-r-lg"
            style={{ height: "400px", width: "50px" }}
          />
          {slides.map((s, index) => (
            <img
              key={index}
              src={s}
              alt={`Slide ${index}`}
              style={getSlideStyle(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8 font-bold text-3xl underline">
        Eventos Populares
        <div></div>
      </div>

      <div>
        <ImageBalls balls={balls} updateCartCount={updateCartCount} />
      </div>
      <div>
        <MostrarEventos items={filterEventsByCategory('Teatro & Arte')} category="Teatro & Arte" />
        <MostrarEventos items={filterEventsByCategory('Música & Festivais')} category="Música & Festivais" />
        <MostrarEventos items={filterEventsByCategory('Família')} category="Família" />
        <MostrarEventos items={filterEventsByCategory('Desporto & Aventura')} category="Desporto & Aventura" />
      </div>
    </div>
  );
};

export default Home;
