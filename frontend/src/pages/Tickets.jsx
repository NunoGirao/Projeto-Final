import React, { useState, useEffect } from 'react';
import NavBar from '../components/navbar';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Token is missing. Please log in again.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5555/api/tickets/user', {
          headers: {
            'x-access-token': token,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch tickets');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError(error.message);
      }
    };

    fetchTickets();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">My Tickets</h1>
        {tickets.length === 0 ? (
          <p>No tickets found</p>
        ) : (
          <ul>
            {tickets.map(ticket => (
              <li key={ticket._id} className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{ticket.name}</h2>
                    <p>{ticket.description}</p>
                    <p>{new Date(ticket.date).toLocaleDateString()}</p>
                  </div>
                  <button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={() => window.location.href = `/ticket/${ticket._id}`}
                  >
                    View Ticket
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Tickets;
