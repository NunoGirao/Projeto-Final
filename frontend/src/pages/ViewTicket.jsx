import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/navbar';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaDownload, FaExclamationCircle, FaClock, FaUsers, FaTag, FaInfoCircle } from 'react-icons/fa';

const ViewTicket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setError('User is not authenticated.');
      setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading your ticket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <FaExclamationCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4 text-red-700">Error</h2>
          <p className="text-center text-gray-700 mb-6">{error}</p>
          <Link to="/tickets" className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
            Voltar aos meus Bilhetes
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <FaTicketAlt className="mx-auto text-6xl text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-yellow-700">Bilhete nao encontrado</h2>
          <p className="text-gray-700 mb-6">Não consiguemos encontra o bilhete que está a procura.</p>
          <Link to="/tickets" className="block w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
            Voltar aos meus Bilhetes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 mt-12">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative h-64">
            <img src={ticket.eventImage} alt={ticket.eventName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white text-center px-4">{ticket.eventName}</h1>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaClock className="mr-2 text-blue-500" />
                <span>{new Date(ticket.eventDate).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                <span>{ticket.eventPlace}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaUsers className="mr-2 text-blue-500" />
                <span>{ticket.eventOccupation} / {ticket.eventCapacity} attendees</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-2xl font-semibold mb-2 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                Detalhes do Evento
              </h2>
              <p className="text-gray-700">{ticket.eventDescription}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FaTag className="mr-2 text-blue-500" />
                  Categoria
                </h3>
                <p>{ticket.eventCategory}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FaTag className="mr-2 text-green-500" />
                  Subcategoria
                </h3>
                <p>{ticket.eventSubcategory}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FaTag className="mr-2 text-purple-500" />
                  Preço
                </h3>
                <p>€{ticket.eventPrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <img src={ticket.qrCode} alt="QR Code" className="w-48 h-48 mx-auto md:mx-0" />
                  <p className="text-center md:text-left text-sm text-gray-600 mt-2 ml-10">Scanear Qr Code</p>
                </div>
                <div className="text-center md:text-right">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 flex items-center justify-center mx-auto md:ml-auto">
                    <FaDownload className="mr-2" /> Baixar Bilhete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link to="/tickets" className="inline-block bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition duration-300">
            Voltar aos Meus Bilhetes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;
