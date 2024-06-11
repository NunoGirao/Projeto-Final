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
      <div className="container mx-auto p-6 mt-8">
        <h1 className="text-4xl font-bold mb-6 text-center">My Tickets</h1>
        {tickets.length === 0 ? (
          <p className="text-center text-lg">No tickets found</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map(ticket => (
              <li key={ticket._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <img src={ticket.image} alt={ticket.eventName} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{ticket.eventName}</h2>
                  <p className="text-gray-600 mb-2">{ticket.eventDescription}</p>
                  <p className="text-gray-700 font-semibold mb-4">{new Date(ticket.eventDate).toLocaleDateString()}</p>
                  <button
                    className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-300"
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
