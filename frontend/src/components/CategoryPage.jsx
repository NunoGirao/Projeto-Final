import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/navbar';
import MostrarEventos from '../components/mostrareventos';

const CategoryPage = () => {
  const { category } = useParams();
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5555/api/events?category=${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [category]);

  const filterEventsBySubcategory = (subcategory) => {
    return events.filter(event => event.subcategory === subcategory);
  };

  const subcategories = [
    'Teatro', 'Museus & Exposições', 'Dança',
    'Concertos', 'Festivais',
    'Crianças', 'Família',
    'Desportos', 'Aventura'
  ];

  return (
    <div>
      <NavBar />
      <div className="mt-8">
        {subcategories.map(subcategory => (
          <MostrarEventos
            key={subcategory}
            items={filterEventsBySubcategory(subcategory)}
            category={subcategory}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
