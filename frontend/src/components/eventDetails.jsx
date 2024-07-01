import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillAlt, FaUsers, FaInfoCircle, FaTicketAlt, FaShare, FaClock } from 'react-icons/fa';
import NavBar from './navbar';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5555/api/events/${id}`);
        if (!response.ok) throw new Error('Falha ao obter detalhes do evento');
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Erro ao obter detalhes do evento:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBuyTickets = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert('Por favor, inicie sessão para comprar bilhetes');
      return;
    }
    try {
      const response = await fetch('http://localhost:5555/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ eventId: id, quantity })
      });
      if (!response.ok) throw new Error('Falha ao adicionar ao carrinho');
      alert('Bilhetes adicionados ao carrinho!');
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert('Falha ao adicionar ao carrinho');
    }
  };

  if (!event) return <div className="flex justify-center items-center h-screen">A carregar...</div>;

  const center = {
    lat: parseFloat(event.place.latitude),
    lng: parseFloat(event.place.longitude)
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 mt-16">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="relative">
            <img src={event.image} alt={event.name} className="w-full h-96 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex items-end">
              <div className="p-6 w-full">
                <h1 className="text-4xl font-bold text-white mb-2">{event.name}</h1>
                <div className="flex flex-wrap gap-4 text-white">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>{new Date(event.date).toLocaleDateString('pt-PT')}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    <span>{new Date(event.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center">
                    <FaMoneyBillAlt className="mr-2" />
                    <span>{event.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-2" />
                    <span>{event.capacity} participantes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap -mx-4">
              <div className="w-full lg:w-2/3 px-4 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Sobre o Evento</h2>
                <p className="text-gray-700 mb-6">{event.description}</p>
                
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold mb-2">Detalhes do Evento</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-500 mr-2" />
                      <span>{event.place.name}</span>
                    </div>
                    <div className="flex items-center">
                      <FaInfoCircle className="text-gray-500 mr-2" />
                      <span>Ocupação: {event.occupation}</span>
                    </div>
                  </div>
                </div>

                <div className="h-64 rounded-lg overflow-hidden shadow-inner">
                  <LoadScript googleMapsApiKey="AIzaSyBdM3ujB-MKTLuZTnJ66m_X2-rfKDthWh4">
                    <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={center} zoom={15}>
                      <Marker position={center} />
                    </GoogleMap>
                  </LoadScript>
                </div>
              </div>
              
              <div className="w-full lg:w-1/3 px-4">
                <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                  <h2 className="text-2xl font-semibold mb-4">Comprar Bilhetes</h2>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg">Preço:</span>
                    <span className="text-2xl font-bold">{event.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg">Quantidade:</span>
                    <div className="flex items-center">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-gray-300 text-gray-700 px-3 py-1 rounded-l hover:bg-gray-400 transition duration-300">-</button>
                      <span className="bg-white px-4 py-1">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="bg-gray-300 text-gray-700 px-3 py-1 rounded-r hover:bg-gray-400 transition duration-300">+</button>
                    </div>
                  </div>
                  <button 
                    onClick={handleBuyTickets}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300 flex items-center justify-center"
                  >
                    <FaTicketAlt className="mr-2" />
                    Comprar Bilhetes
                  </button>
                  <div className="mt-6 text-center">
                    <button className="text-blue-600 hover:text-blue-800 transition duration-300">
                      <FaShare className="inline mr-2" />
                      Partilhar Evento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;