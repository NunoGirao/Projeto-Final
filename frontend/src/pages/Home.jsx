import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/navbar";
import MostrarEventos from '../components/mostrareventos';
import ImageBalls from "../components/bolas";

const Home = () => {
  const [topEvents, setTopEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [positions, setPositions] = useState([
    { size: 250, x: 50, y: 50 },
    { size: 150, x: 70, y: 30 },
    { size: 150, x: 32, y: 70 },
    { size: 150, x: 10, y: 50 },
    { size: 150, x: 25, y: 30 },
    { size: 150, x: 80, y: 80 },
    { size: 150, x: 90, y: 50 },
    { size: 100, x: 65, y: 75 },
    { size: 100, x: 20, y: 80 },
    { size: 100, x: 82, y: 20 },
    { size: 100, x: 38, y: 20 },
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "https://i.redd.it/u8bydp4wtiz91.png",
    "https://images7.alphacoders.com/587/587593.png",
    "https://images.gamebanana.com/img/ss/mods/52107ac3349f6.jpg",
  ];

  useEffect(() => {
    const fetchTopEvents = async () => {
      try {
        const response = await fetch('http://localhost:5555/api/events/top-events');
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
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const response = await fetch('http://localhost:5555/api/cart', {
          headers: {
            'x-access-token': token,
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

  const adjustBalls = () => {
    // ... (keep the existing adjustBalls function)
  };

  useEffect(() => {
    adjustBalls();
    window.addEventListener('resize', adjustBalls);

    return () => {
      window.removeEventListener('resize', adjustBalls);
    };
  }, []);

  const balls = topEvents.slice(0, positions.length).map((event, index) => ({
    ...event,
    ...positions[index]
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filterEventsByCategory = (category) => {
    return events.filter(event => event.category === category);
  };

  return (
    <div>
      <div className="relative overflow-hidden mt-12" style={{ height: "400px" }}>
        <AnimatePresence initial={false}>
          <motion.img
            key={currentSlide}
            src={slides[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-50">
          <motion.div
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            key={currentSlide}
          />
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