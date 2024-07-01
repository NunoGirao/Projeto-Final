import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/navbar';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaExclamationCircle, FaClock, FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setError('Token is missing. Please log in again.');
      setLoading(false);
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sortedAndFilteredTickets = useMemo(() => {
    return tickets
      .filter(ticket => 
        ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortConfig.key === 'date') {
          const dateA = new Date(a.eventDate);
          const dateB = new Date(b.eventDate);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
          const nameA = a.eventName.toLowerCase();
          const nameB = b.eventName.toLowerCase();
          return sortConfig.direction === 'asc' 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
      });
  }, [tickets, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-xl text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <NavBar />
        <div className="container mx-auto p-6 mt-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
            <div className="flex items-center">
              <FaExclamationCircle className="mr-2" aria-hidden="true" />
              <p className="font-bold">Error</p>
            </div>
            <p>{error}</p>
            <button 
              onClick={fetchTickets} 
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <div className="container mx-auto p-6 mt-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">My Tickets</h1>
        
        {tickets.length === 0 ? (
          <div className="text-center bg-gray-50 p-8 rounded-lg shadow">
            <FaTicketAlt className="mx-auto text-6xl text-gray-400 mb-4" aria-hidden="true" />
            <p className="text-xl text-gray-600 mb-4">No tickets found</p>
            <Link to="/" className="inline-block bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300">
              Browse Events
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
              <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search tickets"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Sort by:</span>
                <button
                  className={`px-3 py-1 rounded-full flex items-center ${sortConfig.key === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => handleSort('date')}
                  aria-label={`Sort by date ${sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : ''}`}
                >
                  Date
                  {sortConfig.key === 'date' && (
                    sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" aria-hidden="true" /> : <FaSortAmountDown className="ml-1" aria-hidden="true" />
                  )}
                </button>
                <button
                  className={`px-3 py-1 rounded-full flex items-center ${sortConfig.key === 'name' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => handleSort('name')}
                  aria-label={`Sort by name ${sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : ''}`}
                >
                  Name
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" aria-hidden="true" /> : <FaSortAmountDown className="ml-1" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {sortedAndFilteredTickets.map((ticket) => (
                <div key={ticket._id} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0">
                      <img src={ticket.eventImage} alt={ticket.eventName} className="h-48 w-full object-cover md:w-48" />
                    </div>
                    <div className="p-8 flex-grow">
                      <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{ticket.eventCategory}</div>
                      <Link to={`/ticket/${ticket._id}`} className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{ticket.eventName}</Link>
                      <p className="mt-2 text-gray-500">{ticket.eventDescription.substring(0, 100)}...</p>
                      <div className="mt-4 flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" aria-hidden="true" />
                        <span className="text-gray-600">{formatDate(ticket.eventDate)}</span>
                        <FaClock className="text-gray-400 ml-4 mr-2" aria-hidden="true" />
                        <span className="text-gray-600">{formatTime(ticket.eventDate)}</span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <FaMapMarkerAlt className="text-gray-400 mr-2" aria-hidden="true" />
                        <span className="text-gray-600">{ticket.eventPlace}</span>
                      </div>
                    </div>
                    <div className="p-4 md:p-8 flex items-center justify-center bg-gray-50">
                      <Link 
                        to={`/ticket/${ticket._id}`}
                        className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 text-center"
                        aria-label={`View ticket for ${ticket.eventName}`}
                      >
                        View Ticket
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tickets;
