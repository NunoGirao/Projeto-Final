import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavBar from '../components/navbar';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [eventResults, setEventResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      const token = localStorage.getItem('userToken'); // Retrieve the token

      if (!token) {
        setError('User not authenticated');
        return;
      }

      try {
        const [eventsResponse, usersResponse] = await Promise.all([
          fetch(`http://localhost:5555/api/events/search?query=${query}`, {
            headers: {
              'x-access-token': token
            }
          }),
          fetch(`http://localhost:5555/api/users/search?query=${query}`, {
            headers: {
              'x-access-token': token
            }
          })
        ]);

        if (!eventsResponse.ok || !usersResponse.ok) {
          const errorData = await eventsResponse.json();
          throw new Error(errorData.message || 'Failed to fetch search results');
        }

        const eventsData = await eventsResponse.json();
        const usersData = await usersResponse.json();
        setEventResults(eventsData);
        setUserResults(usersData);
      } catch (error) {
        setError(error.message);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-6 mt-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Procurar resultados de "{query}"</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {eventResults.length === 0 && userResults.length === 0 ? (
          <div className="text-center text-lg">Sem Resultados encontrados</div>
        ) : (
          <div className="w-4/5 mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Eventos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {eventResults.map(result => (
                <div key={result._id} className="relative group bg-white shadow-md rounded-lg overflow-hidden">
                  <img
                    src={result.image || 'https://via.placeholder.com/300'}
                    alt={result.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-75 text-white p-4 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-full group-hover:translate-y-0">
                    <h2 className="text-xl font-semibold mb-2">{result.name}</h2>
                    <p className="text-sm mb-2">{truncateDescription(result.description, 100)}</p>
                    <p className="text-sm">{result.place?.name}</p>
                    <Link
                      to={`/events/${result._id}`}
                      className="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-lg"
                    >
                      Mais Info
                    </Link>
                    <button
                      className="mt-2 inline-block bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-lg"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mb-4">Utilizadores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userResults.map(user => (
                <div key={user._id} className="relative group bg-white shadow-md rounded-lg overflow-hidden">
                  <img
                    src={user.profilePhoto || 'https://via.placeholder.com/300'}
                    alt={user.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-75 text-white p-4 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-full group-hover:translate-y-0">
                    <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
                    <p className="text-sm mb-2">{user.email}</p>
                    <Link
                      to={`/perfil/${user.name}`}
                      className="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-lg"
                    >
                      Ver Perfil
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
