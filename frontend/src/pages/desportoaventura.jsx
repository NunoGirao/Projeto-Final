import React, { useState, useEffect } from 'react';
import NavBar from '../components/navbar';
import MostrarEventos from '../components/mostrareventos';

const DesportoAventura = () => {
  const [corridas, setCorridas] = useState([]);
  const [lazer, setLazer] = useState([]);

  useEffect(() => {
    const fetchEvents = async (subcategory, setEvents) => {
      try {
        console.log(`Fetching ${subcategory} events...`);
        const response = await fetch(`http://localhost:5555/api/events/category?category=${encodeURIComponent('Desporto & Aventura')}&subcategory=${encodeURIComponent(subcategory)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${subcategory} events`);
        }
        const data = await response.json();
        console.log(`${subcategory} events:`, data);
        setEvents(data);
      } catch (error) {
        console.error(`Error fetching ${subcategory} events:`, error);
      }
    };

    fetchEvents('Corridas', setCorridas);
    fetchEvents('Lazer', setLazer);
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-4 mt-12">

        <MostrarEventos items={corridas} category="Corridas" />
        <MostrarEventos items={lazer} category="Lazer" />
      </div>
    </div>
  );
};

export default DesportoAventura;
