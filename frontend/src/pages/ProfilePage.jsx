import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/navbar';

const ProfilePage = () => {
  const { name } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [tickets, setTickets] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5555/api/users/name/${name}`, {
          method: 'GET',
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
        setProfilePhoto(data.profilePhoto);

        const userProfileResponse = await fetch('http://localhost:5555/api/users/profile/me', {
          method: 'GET',
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!userProfileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userProfileData = await userProfileResponse.json();
        setIsOwnProfile(userProfileData._id === data._id);
        if (userProfileData._id !== data._id) {
          checkFollowingStatus(data._id);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProfile();
  }, [name]);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Token is missing. Please log in again.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5555/api/tickets/user', {
          headers: {
            'x-access-token': token,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch tickets');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError(error.message);
      }
    };

    fetchTickets();
  }, []);

  const checkFollowingStatus = async (userId) => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch('http://localhost:5555/api/users/profile/me', {
        method: 'GET',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.following.includes(userId));
      }
    } catch (error) {
      console.error('Error checking following status:', error);
    }
  };

  const handleFollow = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch(`http://localhost:5555/api/follow/${profile._id}`, {
        method: 'POST',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsFollowing(true);
      } else {
        throw new Error('Failed to follow user');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch(`http://localhost:5555/api/unfollow/${profile._id}`, {
        method: 'POST',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsFollowing(false);
      } else {
        throw new Error('Failed to unfollow user');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error unfollowing user:', error);
    }
  };

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
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-12 w-full">
        <div className="relative w-full h-32 bg-red-100 flex flex-col md:flex-row items-center justify-center md:justify-start">
          <div className="flex items-center md:ml-12 transform translate-y-1/3 md:translate-y-0">
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-40 h-40 md:w-48 md:h-48 rounded-full cursor-pointer"
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
          <div className="mt-10 text-center md:text-left md:ml-4">
            <div className="text-3xl font-semibold">{profile.name}</div>
            {!isOwnProfile && (
              isFollowing ? (
                <button onClick={handleUnfollow} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Unfollow</button>
              ) : (
                <button onClick={handleFollow} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Follow</button>
              )
            )}
            <nav className="mt-4 flex justify-center md:justify-start space-x-4">
              <Link to={`/perfil/${profile.name}`} className="px-4 py-2 hover:text-blue-500">Visão Geral</Link>
              <Link to={`/perfil/${profile.name}/following`} className="px-4 py-2 hover:text-blue-500">A seguir</Link>
              <Link to={`/perfil/${profile.name}/followers`} className="px-4 py-2 hover:text-blue-500">Seguidores</Link>
            </nav>
          </div>
        </div>
        <div className="relative mt-8 w-full flex justify-center space-x-4">
          <div className="w-32 h-32 md:w-64 md:h-64 border-2 border-dotted border-gray-400 flex items-center justify-center">
            <div className="text-gray-400 text-4xl">+</div>
          </div>
          <div className="w-32 h-32 md:w-64 md:h-64 border-2 border-dotted border-gray-400 flex items-center justify-center">
            <div className="text-gray-400 text-4xl">+</div>
          </div>
          <div className="w-32 h-32 md:w-64 md:h-64 border-2 border-dotted border-gray-400 flex items-center justify-center">
            <div className="text-gray-400 text-4xl">+</div>
          </div>
          <div className="w-32 h-32 md:w-64 md:h-64 border-2 border-dotted border-gray-400 flex items-center justify-center">
            <div className="text-gray-400 text-4xl">+</div>
          </div>
          <button className="border rounded px-4 py-2">Ver todas as lembranças</button>
        </div>
        <div className="mt-8 w-full px-4 md:px-0">
          <h2 className="text-xl font-bold mb-4">Meus Bilhetes</h2>
          <div className="flex flex-wrap gap-4 justify-start">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="w-32 h-32 md:w-48 md:h-64 border rounded shadow-lg overflow-hidden">
                <img src={ticket.image} alt="Bilhete" className="w-full h-full object-cover" />
                <div className="px-2 py-1 text-center">
                  <p className="text-xs md:text-sm">Compraram o bilhete</p>
                </div>
              </div>
            ))}
          </div>
          {profile.nftImages && profile.nftImages.length > 0 && (
            <>
              <h2 className="text-xl font-bold mt-8 mb-4">Minhas Imagens NFT</h2>
              <div className="flex flex-wrap gap-4 justify-start">
                {profile.nftImages.map((nftImage, index) => (
                  <div key={index} className="w-32 h-32 md:w-48 md:h-64 border rounded shadow-lg overflow-hidden">
                    <img src={nftImage} alt="NFT" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
