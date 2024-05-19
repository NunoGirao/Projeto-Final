import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavBar from '../components/navbar';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`http://localhost:5555/api/events/search?query=${query}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch search results');
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        setError(error.message);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-6 mt-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Search Results for "{query}"</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {results.length === 0 ? (
          <div className="text-center text-lg">No results found</div>
        ) : (
          <div className="w-4/5 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map(result => (
                <div key={result._id} className="relative group bg-white shadow-md rounded-lg overflow-hidden">
                  <img
                    src={result.image || 'https://via.placeholder.com/300'}
                    alt={result.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-75 text-white p-4 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-full group-hover:translate-y-0">
                    <h2 className="text-xl font-semibold mb-2">{result.name}</h2>
                    <p className="text-sm mb-2">{result.description}</p>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
