import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/navbar';

const SearchUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5555/api/users/search?query=${searchQuery}`, {
        method: 'GET',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16">
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={handleSearch} className="flex mb-4">
            <input
              type="text"
              placeholder="Search users by name or email"
              className="flex-grow p-2 border border-gray-300 rounded-l"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">Search</button>
          </form>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <ul>
            {searchResults.map(user => (
              <li key={user._id} className="bg-white p-4 mb-2 rounded shadow">
                <div className="flex items-center">
                  <img src={user.profilePhoto || 'https://via.placeholder.com/50'} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    <Link to={`/user/${user._id}`} className="text-blue-500">View Profile</Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchUsersPage;
