// src/components/UserListPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaUserMinus, FaSearch } from 'react-icons/fa';
import NavBar from './navbar';
import ProfileHeader from './ProfileHeader';

const UserCard = ({ user, isFollowing, onFollow, onUnfollow }) => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white shadow rounded-lg p-4 flex items-center justify-between"
  >
    <div className="flex items-center">
      <img src={user.profilePhoto} alt={user.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
      <div>
        <Link to={`/perfil/${user.name}`} className="text-lg font-medium text-blue-600 hover:underline">{user.name}</Link>
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => isFollowing ? onUnfollow(user._id) : onFollow(user._id)}
      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isFollowing ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
      }`}
    >
      {isFollowing ? <FaUserMinus className="mr-1" /> : <FaUserPlus className="mr-1" />}
      {isFollowing ? 'Unfollow' : 'Follow'}
    </motion.button>
  </motion.li>
);

const UserListPage = ({ pageType, pageTitle }) => {
  const { name } = useParams();
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProfileAndUsers = useCallback(async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      const profileResponse = await fetch(`http://localhost:5555/api/users/name/${name}`, {
        method: 'GET',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profileData = await profileResponse.json();
      setProfile(profileData);

      const usersResponse = await fetch(`http://localhost:5555/api/users/${name}/${pageType}`, {
        method: 'GET',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (!usersResponse.ok) {
        throw new Error(`Failed to fetch ${pageType} list`);
      }

      const usersData = await usersResponse.json();
      setUsers(usersData);
      setFilteredUsers(usersData);

      // Check if it's the user's own profile
      const userProfileResponse = await fetch('http://localhost:5555/api/users/profile/me', {
        method: 'GET',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (userProfileResponse.ok) {
        const userProfileData = await userProfileResponse.json();
        setIsOwnProfile(userProfileData._id === profileData._id);
        setIsFollowing(userProfileData.following.includes(profileData._id));
      }
    } catch (error) {
      setError(error.message);
    }
  }, [name, pageType]);

  useEffect(() => {
    fetchProfileAndUsers();
  }, [fetchProfileAndUsers]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleFollow = async (userId) => {
    // Implement follow logic
  };

  const handleUnfollow = async (userId) => {
    // Implement unfollow logic
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
        />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{pageTitle}</h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={`Pesquisar ${pageType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <AnimatePresence>
            {filteredUsers.length > 0 ? (
              <motion.ul className="space-y-4">
                {filteredUsers.map(user => (
                  <UserCard
                    key={user._id}
                    user={user}
                    isFollowing={user.isFollowing}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                  />
                ))}
              </motion.ul>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500 mt-8"
              >
                Nenhuma {pageType} encontradda.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;