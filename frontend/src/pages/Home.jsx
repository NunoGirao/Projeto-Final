import React, { useState, useEffect } from "react"; // Import useState here
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import ola from "../assets/ola.png";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import ImageBalls from "../components/bolas";
import teatro from "../assets/teatro.png";
import MostrarEventos from '../components/mostrareventos'; // Import the MostrarEventos component
import NavBar from "../components/navbar";


const Home = () => {
  const slides = [
    "https://i.redd.it/u8bydp4wtiz91.png",
    "https://images7.alphacoders.com/587/587593.png",
    "https://images.gamebanana.com/img/ss/mods/52107ac3349f6.jpg",
  ];

  const images = [
    "https://i.redd.it/u8bydp4wtiz91.png",
    "https://i.redd.it/u8bydp4wtiz91.png",
    "https://images7.alphacoders.com/587/587593.png",
    "https://images7.alphacoders.com/587/587593.png",
    "https://images7.alphacoders.com/587/587593.png",
    "https://images7.alphacoders.com/587/587593.png",
  ];

  const balls = [
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 250,
      x: 50,
      y: 50,
      title: "Ball 1",
      description: "Description for Ball 1",
    }, // Bola central
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 150,
      x: 70,
      y: 30,
      title: "Ball 2",
      description: "Description for Ball 2",
    }, // Outras bolas com posições relativas
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 150,
      x: 35,
      y: 70,
      title: "Ball 3",
      description: "Description for Ball 3",
    },
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 150,
      x: 10,
      y: 50,
      title: "Ball 4",
      description: "Description for Ball 4",
    },
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 150,
      x: 25,
      y: 30,
      title: "Ball 5",
      description: "Description for Ball 5",
    },
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 100,
      x: 70,
      y: 30,
      title: "Ball 6",
      description: "Description for Ball 6",
    }, // Outras bolas com posições relativas
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 150,
      x: 80,
      y: 80,
      title: "Ball 7",
      description: "Description for Ball 7",
    },
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 150,
      x: 90,
      y: 50,
      title: "Ball 8",
      description: "Description for Ball 8",
    },
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 100,
      x: 65,
      y: 75,
      title: "Ball 9",
      description: "Description for Ball 9",
    },
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 150,
      x: 70,
      y: 30,
      title: "Ball 10",
      description: "Description for Ball 10",
    }, // Outras bolas com posições relativas
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 100,
      x: 20,
      y: 80,
      title: "Ball 11",
      description: "Description for Ball 11",
    },
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 100,
      x: 80,
      y: 20,
      title: "Ball 12",
      description: "Description for Ball 12",
    },
    {
      url: "https://images7.alphacoders.com/587/587593.png",
      size: 100,
      x: 38,
      y: 20,
      title: "Ball 13",
      description: "Description for Ball 13",
    },
    // Adicione mais bolas conforme necessário
  ];
  
  const items = [
    { id: 1, url: "https://images7.alphacoders.com/587/587593.png", title: 'Champions League', description: 'Compre agora online' },
    { id: 2, url: "https://images7.alphacoders.com/587/587593.png", title: 'Model', description: 'Compre agora online' },
    { id: 3, url: "https://images7.alphacoders.com/587/587593.png", title: 'Queima Das Fitas', description: 'Compre agora online' },
    { id: 4, url: "https://images7.alphacoders.com/587/587593.png", title: 'Linkin Park', description: 'Compre agora online' },
    { id: 5, url: "https://images7.alphacoders.com/587/587593.png", title: 'Famous Person', description: 'Compre agora online' },
    { id: 6, url: "https://images7.alphacoders.com/587/587593.png", title: 'Famous Person', description: 'Compre agora online' },
    { id: 7, url: "https://images7.alphacoders.com/587/587593.png", title: 'Champions League', description: 'Compre agora online' },
    { id: 8, url: "https://images7.alphacoders.com/587/587593.png", title: 'Champions League', description: 'Compre agora online' },
    { id: 9, url: "https://images7.alphacoders.com/587/587593.png", title: 'Champions League', description: 'Compre agora online' },
    { id: 10, url: "https://images7.alphacoders.com/587/587593.png", title: 'Champions League', description: 'Compre agora online' },
    { id: 11, url: "https://images7.alphacoders.com/587/587593.png", title: 'Champions League', description: 'Compre agora online' }
  ]
  const [current, setCurrent] = useState(0); // useState now properly imported
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  // Configuração do useEffect para mudar slides automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((current) => (current + 1) % slides.length);
    }, 5000); // Change slide every 5000 ms (5 seconds)
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
    transform:
      index === current
        ? "translateX(0)"
        : index < current
        ? "translateX(-100%)"
        : "translateX(100%)",
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

  return (
    <div>
      <NavBar />
      <div>
        <div className="relative overflow-hidden mt-10" style={{ height: "400px" }}>
          <BsChevronCompactLeft
            onClick={() =>
              setCurrent(current === 0 ? length - 1 : current - 1)
            }
            className="absolute left-0 text-white text-3xl cursor-pointer z-10 bg-black bg-opacity-20 rounded-r-lg"
            style={{ height: "400px", width: "50px" }}
          />
          <BsChevronCompactRight
            onClick={() =>
              setCurrent(current === length - 1 ? 0 : current + 1)
            }
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
        <ImageBalls balls={balls} />
      </div>
            <div>
            <MostrarEventos items={items} />
          </div>
          <div>
            <MostrarEventos items={items} />
          </div>
          <div>
            <MostrarEventos items={items} />
          </div>
          <div>
            <MostrarEventos items={items} />
          </div>
    </div>
  );
};

export default Home;
