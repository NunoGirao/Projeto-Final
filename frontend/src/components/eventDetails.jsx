import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './navbar';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5555/api/events/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-4 mt-12">
        <div className="event-container p-6 border border-black max-w-4xl"> {/* Increased padding */}
          <div className="bg-black text-white p-2 mb-4">
            <h1 className="text-3xl font-bold">{event.name}</h1>
          </div>
          <img src={event.image} alt={event.name} className="w-1/2 float-left mr-4 mb-4" />
          <p className="mb-6 text-xl"><strong>Local:</strong> {event.place.name}</p>
          <p className="mb-6"><strong>Data:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <div className="flex mb-8"> {/* Container for Capacidade and Ocupação */}
            <p className="mr-4"><strong>Capacidade:</strong> {event.capacity}</p>
            <div className="border-r border-black h-6"></div>
            <p className="ml-4"><strong>Ocupação:</strong> {event.occupation}</p>
          </div>
          <p className="mb-6"><strong>Preço:</strong> {event.price}€</p>
          <div className="mb-6">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Comprar
            </button>
          </div>
          <p className="mb-2">{event.description}</p> {/* Second paragraph for event.description */}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;