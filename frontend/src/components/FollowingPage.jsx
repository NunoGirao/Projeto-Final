import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/navbar';

const FollowingPage = () => {
  const { name } = useParams();
  const [profile, setProfile] = useState(null);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileAndFollowing = async () => {
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
        setProfilePhoto(profileData.profilePhoto);

        const followingResponse = await fetch(`http://localhost:5555/api/users/${name}/following`, {
          method: 'GET',
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!followingResponse.ok) {
          throw new Error('Failed to fetch following list');
        }

        const followingData = await followingResponse.json();
        setFollowing(followingData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProfileAndFollowing();
  }, [name]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      handlePhotoUpload(file);
    }
  };

  const handlePhotoUpload = async (file) => {
    const token = localStorage.getItem('userToken');
    if (!token || !file) {
      setError('No token or photo found. Please log in and select a photo.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const response = await fetch('http://localhost:5555/api/users/profile-photo', {
        method: 'PUT',
        headers: {
          'x-access-token': token,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile photo');
      }

      const data = await response.json();
      setProfile(data);
      setProfilePhoto(data.profilePhoto);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleProfilePhotoClick = () => {
    fileInputRef.current.click();
  };

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">{error}</div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-12">
        <div className="relative w-full h-32 bg-red-100 ">
          <div className="absolute ml-72 transform translate-y-1/3">
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-40 h-40 rounded-full cursor-pointer"
              onClick={handleProfilePhotoClick}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className="mt-10 text-center">
            <div className="text-3xl font-semibold">{profile.name}</div>
            <nav className="mt-4 flex justify-center space-x-4">
              <Link to={`/perfil/${profile.name}`} className="px-4 py-2 hover:text-blue-500">Visão Geral</Link>
              <Link to={`/perfil/${profile.name}/following`} className="px-4 py-2 hover:text-blue-500">A seguir</Link>
              <Link to={`/perfil/${profile.name}/followers`} className="px-4 py-2 hover:text-blue-500">Seguidores</Link>
            </nav>
          </div>
        </div>
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16">
          <h1 className="text-3xl font-semibold mb-8"> A Seguir</h1>
          <ul className="w-full max-w-2xl">
            {following.map(user => (
              <li key={user._id} className="flex items-center p-4 bg-white shadow mb-4 rounded-lg">
                <img src={user.profilePhoto} alt={user.name} className="w-16 h-16 rounded-full mr-4" />
                <div className="flex-grow">
                  <Link to={`/perfil/${user.name}`} className="hover:underline">
                    <h2 className="text-xl font-medium">{user.name}</h2>
                  </Link>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FollowingPage;
