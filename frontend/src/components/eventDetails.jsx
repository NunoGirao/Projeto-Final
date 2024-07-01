import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillAlt, FaUsers, FaInfoCircle } from 'react-icons/fa';
import NavBar from './navbar';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5555/api/events/${id}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar detalhes do evento');
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do evento:", error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <div className="flex justify-center items-center h-screen">A carregar...</div>;
  }

  const center = {
    lat: parseFloat(event.place.latitude),
    lng: parseFloat(event.place.longitude)
  };

  const handleBuyTickets = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert('Por favor, faça login para comprar bilhetes');
      return;
    }

    try {
      const response = await fetch('http://localhost:5555/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ eventId: id, quantity: 1 })
      });

      if (!response.ok) {
        throw new Error('Falha ao adicionar ao carrinho');
      }

      alert('Bilhete adicionado ao carrinho!');
      const result = await response.json();
      console.log(result);  // Log do backend
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert('Falha ao adicionar ao carrinho');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 mt-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
            <h1 className="text-4xl font-bold">{event.name}</h1>
            <div className="flex space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-3xl" />
                <span className="text-2xl">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMoneyBillAlt className="text-3xl" />
                <span className="text-2xl">€{event.price}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUsers className="text-3xl" />
                <span className="text-2xl">{event.capacity}</span>
              </div>
            </div>
          </div>
          <img src={event.image} alt={event.name} className="w-full h-80 object-cover" />
          <div className="p-6 bg-gray-100">
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <p className="text-lg"><strong>Local:</strong> {event.place.name}</p>
            </div>
            <div className="flex items-center mb-4">
              <FaInfoCircle className="text-gray-500 mr-2" />
              <p className="text-lg"><strong>Ocupação:</strong> {event.occupation}</p>
            </div>
            <p className="text-lg mb-6">{event.description}</p>
            <div className="h-64 rounded overflow-hidden shadow-inner">
              <LoadScript googleMapsApiKey="AIzaSyBdM3ujB-MKTLuZTnJ66m_X2-rfKDthWh4">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={15}
                >
                  <Marker position={center} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-12">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-1/2 mr-2 p-4">
            <img src={event.image} alt={event.name} className="w-full h-32 object-cover mb-4 rounded-lg" />
            <h2 className="text-2xl font-bold mb-2">Detalhes do Evento</h2>
            <p className="text-lg mb-4">Junte-se a nós para mais um evento incrível com grandes atuações.</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-xl text-gray-700" />
                <span className="text-lg">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMoneyBillAlt className="text-xl text-gray-700" />
                <span className="text-lg">€{event.price}</span>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-1/2 ml-2 p-4">
            <h2 className="text-2xl font-bold mb-4">Bilhetes</h2>
            <div className="flex items-center justify-center">
              <div className="w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    className="text-gray-300"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                    strokeDasharray="22, 100"
                  />
                  <path
                    className="text-red-500"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831"
                    fill="none"
                    strokeWidth="3"
                    strokeDasharray="22, 100"
                    strokeDashoffset="75"
                  />
                  <text x="18" y="20.35" className="text-2xl text-red-500 font-bold" textAnchor="middle" fill="currentColor">{event.occupation}</text>
                </svg>
              </div>
            </div>
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={handleBuyTickets}>
              Comprar Bilhetes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
