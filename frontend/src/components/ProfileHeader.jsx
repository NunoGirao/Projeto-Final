// ProfileHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProfileHeader = ({ profile, isOwnProfile, isFollowing, onFollow, onUnfollow }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex sm:space-x-5">
          <div className="flex-shrink-0">
            <img
              src={profile.profilePhoto}
              alt={profile.name}
              className="mx-auto h-20 w-20 rounded-full border-4 border-white -mt-16 sm:-mt-24"
            />
          </div>
          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{profile.name}</h1>
            <p className="text-sm font-medium text-gray-600">@{profile.username}</p>
          </div>
        </div>
        {!isOwnProfile && (
          <div className="mt-5 flex justify-center sm:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isFollowing ? onUnfollow : onFollow}
              className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isFollowing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isFollowing ? <FaUserMinus className="mr-2" /> : <FaUserPlus className="mr-2" />}
              {isFollowing ? 'Unfollow' : 'Follow'}
            </motion.button>
          </div>
        )}
      </div>
    </div>
    <nav className="flex justify-center border-t border-gray-200 bg-gray-50">
      <Link to={`/perfil/${profile.name}`} className="px-3 py-4 text-sm font-medium text-gray-900 hover:text-blue-600">Visão Geral</Link>
      <Link to={`/perfil/${profile.name}/following`} className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-blue-600">A seguir</Link>
      <Link to={`/perfil/${profile.name}/followers`} className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-blue-600">Seguidores</Link>
    </nav>
  </div>
);

export default ProfileHeader;