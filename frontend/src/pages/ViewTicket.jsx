import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/navbar';

const ViewTicket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const response = await fetch(`http://localhost:5555/api/tickets/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch ticket details');
        }
        const data = await response.json();
        setTicket(data);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTicket();
  }, [id]);

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{ticket.name}</h1>
        <img src={ticket.image} alt={ticket.name} className="w-full h-auto mb-4" />
        <p className="mb-4"><strong>Tipo:</strong> {ticket.type}</p>
        <p className="mb-4"><strong>Subtipo:</strong> {ticket.subtype}</p>
        <p className="mb-4"><strong>Data:</strong> {new Date(ticket.date).toLocaleDateString()}</p>
        <p className="mb-4"><strong>Preço:</strong> R${ticket.price}</p>
        <p className="mb-4"><strong>Ocupação:</strong> {ticket.occupation}</p>
        <p className="mb-4"><strong>Capacidade:</strong> {ticket.capacity}</p>
        <p className="mb-4"><strong>Local:</strong> {ticket.place.name}</p>
        <p className="mb-4">{ticket.description}</p>
        <img src={ticket.qrCode} alt="QR Code" className="w-full h-auto mb-4" />
      </div>
    </div>
  );
};

export default ViewTicket;
