import React, { useState, useEffect } from 'react';
import NavBar from '../components/navbar';
import MostrarEventos from '../components/mostrareventos';

const Familia = () => {
  const [teatrosEspetaculos, setTeatrosEspetaculos] = useState([]);
  const [parquesTematicos, setParquesTematicos] = useState([]);
  const [cinema, setCinema] = useState([]);

  useEffect(() => {
    const fetchEvents = async (subcategory, setEvents) => {
      try {
        const response = await fetch(`http://localhost:5555/api/events/category?category=${encodeURIComponent('Família')}&subcategory=${encodeURIComponent(subcategory)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${subcategory} events`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error(`Error fetching ${subcategory} events:`, error);
      }
    };

    fetchEvents('Teatros & Espetáculos', setTeatrosEspetaculos);
    fetchEvents('Parques Temáticos', setParquesTematicos);
    fetchEvents('Cinema', setCinema);
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-4 mt-12">
        <MostrarEventos items={teatrosEspetaculos} category="Teatros & Espetáculos" />
        <MostrarEventos items={parquesTematicos} category="Parques Temáticos" />
        <MostrarEventos items={cinema} category="Cinema" />
      </div>
    </div>
  );
};

export default Familia;
