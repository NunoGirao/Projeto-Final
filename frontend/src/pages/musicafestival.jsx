import React, { useState, useEffect } from 'react';
import NavBar from '../components/navbar';
import MostrarEventos from '../components/mostrareventos';

const MusicaFestival = () => {
  const [concertos, setConcertos] = useState([]);
  const [festivais, setFestivais] = useState([]);
  const [musicaClassica, setMusicaClassica] = useState([]);
  const [fado, setFado] = useState([]);

  useEffect(() => {
    const fetchEvents = async (subcategory, setEvents) => {
      try {
        const response = await fetch(`http://localhost:5555/api/events/category?category=${encodeURIComponent('Música & Festivais')}&subcategory=${encodeURIComponent(subcategory)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${subcategory} events`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error(`Error fetching ${subcategory} events:`, error);
      }
    };

    fetchEvents('Concertos', setConcertos);
    fetchEvents('Festivais', setFestivais);
    fetchEvents('Música Clássica', setMusicaClassica);
    fetchEvents('Fado', setFado);
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-4 mt-12">
        <MostrarEventos items={concertos} category="Concertos" />
        <MostrarEventos items={festivais} category="Festivais" />
        <MostrarEventos items={musicaClassica} category="Música Clássica" />
        <MostrarEventos items={fado} category="Fado" />
      </div>
    </div>
  );
};

export default MusicaFestival;
