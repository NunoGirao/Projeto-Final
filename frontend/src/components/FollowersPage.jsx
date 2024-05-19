import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/navbar';

const FollowersPage = () => {
  const { name } = useParams();
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFollowers = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5555/api/users/${name}/followers`, {
          method: 'GET',
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch followers list');
        }

        const data = await response.json();
        setFollowers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchFollowers();
  }, [name]);

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">{error}</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16">
        <h1 className="text-3xl font-semibold">{name}'s Followers</h1>
        <ul className="w-full max-w-md mt-8">
          {followers.map(user => (
            <li key={user._id} className="flex items-center p-4 bg-white shadow mb-4 rounded-lg">
              <img src={user.profilePhoto} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
              <div>
                <Link to={`/perfil/${user.name}`}>
                  <h2 className="text-xl">{user.name}</h2>
                </Link>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FollowersPage;
