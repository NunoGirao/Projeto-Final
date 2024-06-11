import React, { useState, useEffect } from 'react';
import NavBar from '../components/navbar';
import MostrarEventos from '../components/mostrareventos';

const TeatroArte = () => {
  const [teatro, setTeatro] = useState([]);
  const [museusExposicoes, setMuseusExposicoes] = useState([]);
  const [danca, setDanca] = useState([]);

  useEffect(() => {
    const fetchEvents = async (subcategory, setEvents) => {
      try {
        const response = await fetch(`http://localhost:5555/api/events/category?category=${encodeURIComponent('Teatro & Arte')}&subcategory=${encodeURIComponent(subcategory)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${subcategory} events`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error(`Error fetching ${subcategory} events:`, error);
      }
    };

    fetchEvents('Teatro', setTeatro);
    fetchEvents('Museus & Exposições', setMuseusExposicoes);
    fetchEvents('Dança', setDanca);
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-4 mt-12">
        <MostrarEventos items={teatro} category="Teatro" />
        <MostrarEventos items={museusExposicoes} category="Museus & Exposições" />
        <MostrarEventos items={danca} category="Dança" />
      </div>
    </div>
  );
};

export default TeatroArte;
