import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/navbar';

const ViewTicket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      const token = localStorage.getItem('userToken'); // Ensure you are using the correct token
      if (!token) {
        setError('User is not authenticated.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5555/api/tickets/${id}`, {
          headers: {
            'x-access-token': token,
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch ticket details');
        }
        const data = await response.json();
        setTicket(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTicket();
  }, [id]);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!ticket) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{ticket.eventName}</h1>
        <img src={ticket.eventImage} alt={ticket.eventName} className="w-full h-auto mb-4" />
        <p className="mb-4"><strong>Tipo:</strong> {ticket.eventCategory}</p>
        <p className="mb-4"><strong>Subtipo:</strong> {ticket.eventSubcategory}</p>
        <p className="mb-4"><strong>Data:</strong> {new Date(ticket.eventDate).toLocaleDateString()}</p>
        <p className="mb-4"><strong>Preço:</strong> €{ticket.eventPrice}</p>
        <p className="mb-4"><strong>Ocupação:</strong> {ticket.eventOccupation}</p>
        <p className="mb-4"><strong>Capacidade:</strong> {ticket.eventCapacity}</p>
        <p className="mb-4"><strong>Local:</strong> {ticket.eventPlace}</p>
        <p className="mb-4">{ticket.eventDescription}</p>
        <div className="flex justify-center mb-4">
          <img src={ticket.qrCode} alt="QR Code" className="w-32 h-32" />
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;
